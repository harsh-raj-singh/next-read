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
      console.error('Error fetching liked articles:', error)
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
    console.error('Error in liked articles API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}