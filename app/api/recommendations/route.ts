import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRecommendations, getTrendingArticles } from '@/lib/recommendations/content-based';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || user.is_anonymous) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in.' },
        { status: 401 }
      );
    }
    
    if (authError) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
    
    const { data: interactions } = await supabase
      .from('user_interactions')
      .select('article_id')
      .eq('user_id', user.id);
    
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
      recommendations = await getRecommendations(user.id);
    }
    
    return NextResponse.json({
      success: true,
      recommendations: recommendations || [],
      interactionCount,
      mode: interactionCount < 5 ? 'trending' : 'personalized'
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
