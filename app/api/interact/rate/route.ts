import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { userId, articleId, rating } = await request.json();
    
    if (!userId || !articleId || !rating) {
      return NextResponse.json(
        { error: 'userId, articleId, and rating are required' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase.from('user_interactions').upsert({
      user_id: userId,
      article_id: articleId,
      rating,
      last_visited: new Date().toISOString()
    }, {
      onConflict: 'user_id,article_id'
    });
    
    if (error) {
      console.error('Error rating article:', error);
      return NextResponse.json(
        { error: 'Failed to rate article' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Article rated'
    });
    
  } catch (error) {
    console.error('Error rating article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
