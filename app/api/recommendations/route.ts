import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRecommendations, getTrendingArticles } from '@/lib/recommendations/content-based';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const { data: interactions } = await supabase
      .from('user_interactions')
      .select('article_id')
      .eq('user_id', userId);
    
    const interactionCount = interactions?.length || 0;
    
    let recommendations;
    
    if (interactionCount < 5) {
      const trending = await getTrendingArticles(20);
      recommendations = trending.map(article => ({
        article,
        contentScore: 0,
        collabScore: 0,
        finalScore: article.score / 100,
        reason: 'Trending article'
      }));
    } else {
      recommendations = await getRecommendations(userId);
    }
    
    return NextResponse.json({
      success: true,
      recommendations: recommendations || [],
      interactionCount,
      mode: interactionCount < 5 ? 'trending' : 'personalized'
    });
    
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
