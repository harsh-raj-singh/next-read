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
      .select(`
        article_id,
        articles (
          id,
          title,
          url,
          author,
          score,
          time,
          descendants,
          text_content
        )
      `)
      .eq('user_id', userId)
      .eq('liked', true)
      .order('last_visited', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch liked articles' }, { status: 500 })
    }

    const articles = interactions
      ?.map((interaction: any) => interaction.articles)
      .filter((article: any) => article !== null)

    return NextResponse.json({ 
      success: true, 
      articles: articles || [],
      count: articles?.length || 0
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}