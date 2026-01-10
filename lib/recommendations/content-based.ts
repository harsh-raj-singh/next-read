import { createClient } from '../supabase/server';
import { Article, Interaction, Recommendation, TFIDFVector } from '../hn/types';
import { computeContentScore } from '../ml/similarity';
import { computeTFIDF, extractContent } from '../ml/tfidf';

const EXPLORATION_RATE = 0.3;
const RECOMMENDATION_COUNT = 20;
const MIN_INTERACTIONS_FOR_PERSONALIZED = 5;

export async function getUserPreferences(userId: string): Promise<TFIDFVector> {
  const supabase = await createClient();
  
  const { data: interactions } = await supabase
    .from('user_interactions')
    .select(`
      article_id,
      liked,
      rating
    `)
    .eq('user_id', userId)
    .in('liked', [true]);
  
  if (!interactions || interactions.length === 0) {
    return { terms: [], scores: [], magnitude: 0 };
  }
  
  const articleIds = interactions.map(i => i.article_id);
  
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, text_content, tfidf_vector')
    .in('id', articleIds);
  
  if (!articles || articles.length === 0) {
    return { terms: [], scores: [], magnitude: 0 };
  }
  
  const articlesMap = new Map(articles.map(a => [a.id, a]));
  
  let combinedContent = '';
  interactions.forEach(interaction => {
    const article = articlesMap.get(interaction.article_id);
    if (article && article.tfidf_vector) {
      const weight = interaction.rating ? (interaction.rating / 5) : 1;
      combinedContent += ` ${extractContent(article.title, article.text_content)} `.repeat(Math.ceil(weight * 2));
    }
  });
  
  return computeTFIDF(combinedContent);
}

export async function getContentBasedRecommendations(
  userId: string,
  limit: number = RECOMMENDATION_COUNT
): Promise<Recommendation[]> {
  const supabase = await createClient();
  
  const userPreferences = await getUserPreferences(userId);
  
  if (userPreferences.magnitude === 0) {
    return [];
  }
  
  const { data: seenArticles } = await supabase
    .from('user_interactions')
    .select('article_id')
    .eq('user_id', userId);
  
  const seenIds = new Set(seenArticles?.map(a => a.article_id) || []);
  
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
  
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .gte('time', sevenDaysAgo)
    .not('id', 'in', `(${Array.from(seenIds).join(',')})`)
    .limit(100)
    .order('score', { ascending: false });
  
  if (!articles || articles.length === 0) {
    return [];
  }
  
  const scoredArticles = articles
    .map(article => {
      if (!article.tfidf_vector) {
        return {
          article,
          contentScore: 0,
          collabScore: 0,
          finalScore: 0,
          reason: 'Trending article'
        };
      }
      
      const contentScore = computeContentScore(
        userPreferences,
        article.tfidf_vector
      );
      
      let reason = 'Trending article';
      if (contentScore > 0.5) {
        reason = 'Similar to articles you liked';
      } else if (contentScore > 0.3) {
        reason = 'Might interest you';
      }
      
      return {
        article,
        contentScore,
        collabScore: 0,
        finalScore: contentScore,
        reason
      };
    })
    .filter(rec => rec.contentScore > 0.1 || rec.reason === 'Trending article');
  
  return scoredArticles
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);
}

export async function getExplorationRecommendations(
  limit: number = 10
): Promise<Recommendation[]> {
  const supabase = await createClient();
  
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
  
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .gte('time', thirtyDaysAgo)
    .order('RANDOM()')
    .limit(limit);
  
  if (!articles || articles.length === 0) {
    return [];
  }
  
  return articles.map(article => ({
    article,
    contentScore: 0,
    collabScore: 0,
    finalScore: 0,
    reason: 'Exploration: Discovering new topics'
  }));
}

export async function getRecommendations(userId: string): Promise<Recommendation[]> {
  const shouldExplore = Math.random() < EXPLORATION_RATE;
  
  if (shouldExplore) {
    const explorationRecs = await getExplorationRecommendations(5);
    const contentRecs = await getContentBasedRecommendations(userId, 15);
    return [...explorationRecs, ...contentRecs];
  } else {
    return await getContentBasedRecommendations(userId, RECOMMENDATION_COUNT);
  }
}

export async function getTrendingArticles(limit: number = 20): Promise<Article[]> {
  const supabase = await createClient();
  
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
  
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .gte('time', sevenDaysAgo)
    .order('score', { ascending: false })
    .limit(limit);
  
  return articles || [];
}
