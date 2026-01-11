import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: interactions, error } = await supabase
      .from('user_interactions')
      .select('article_id, liked, disliked, rating')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user interactions:', error)
      return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      interactions: interactions || []
    })
  } catch (error) {
    console.error('Error in interactions API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}