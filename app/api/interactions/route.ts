import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user || user.is_anonymous) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    if (authError) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }

    const userId = user.id

    const { data: interactions, error } = await supabase
      .from('user_interactions')
      .select('article_id, liked, disliked, rating')
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      interactions: interactions || []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}