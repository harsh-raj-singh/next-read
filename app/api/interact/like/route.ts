import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { userId, articleId } = await request.json();
    
    if (!userId || !articleId) {
      return NextResponse.json(
        { error: 'userId and articleId are required' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase.from('user_interactions').upsert({
      user_id: userId,
      article_id: articleId,
      liked: true,
      disliked: false,
      last_visited: new Date().toISOString()
    }, {
      onConflict: 'user_id,article_id'
    });
    
    if (error) {
      console.error('Error liking article:', error);
      return NextResponse.json(
        { error: 'Failed to like article' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Article liked'
    });
    
  } catch (error) {
    console.error('Error liking article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
