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
    
    const { error: rpcError } = await supabase.rpc('increment_visit_count', {
      user_id_param: userId,
      article_id_param: articleId
    });
    
    if (rpcError) {
      console.error('Error incrementing visit count:', rpcError);
      return NextResponse.json(
        { error: 'Failed to track view' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'View tracked'
    });
    
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
