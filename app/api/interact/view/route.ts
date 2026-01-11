import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || user.is_anonymous) {
      return NextResponse.json(
        { error: 'Authentication required to track views. Please sign in.' },
        { status: 401 }
      );
    }
    
    if (authError) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
    
    const { articleId } = await request.json();
    const userId = user.id;
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId is required' },
        { status: 400 }
      );
    }
    
    const { error: rpcError } = await supabase.rpc('increment_visit_count', {
      user_id_param: userId,
      article_id_param: articleId
    });
    
    if (rpcError) {
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
