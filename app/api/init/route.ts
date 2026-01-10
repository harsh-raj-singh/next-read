import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchValidStories } from '@/lib/hn/fetch';
import { computeTFIDF, extractContent } from '@/lib/ml/tfidf';

const ARTICLE_COUNT = 100;

export async function GET() {
  try {
    const supabase = await createClient();
    
    const stories = await fetchValidStories(ARTICLE_COUNT);
    
    if (stories.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No valid stories found',
        fetched: 0 
      });
    }
    
    let upsertCount = 0;
    let skippedCount = 0;
    
    for (const story of stories) {
      const content = extractContent(story.title || '', story.text || '');
      const tfidfVector = computeTFIDF(content);
      
      const { error } = await supabase.from('articles').upsert({
        id: story.id,
        title: story.title || '',
        url: story.url || null,
        text_content: story.text || '',
        author: story.by,
        score: story.score || 0,
        time: story.time,
        type: story.type,
        descendants: story.descendants || 0,
        tfidf_vector: tfidfVector,
        fetched_at: new Date().toISOString(),
        tags: []
      }, {
        onConflict: 'id'
      });
      
      if (error) {
        console.error(`Error upserting article ${story.id}:`, error);
        skippedCount++;
      } else {
        upsertCount++;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully initialized ${upsertCount} articles`,
      stats: {
        total_fetched: stories.length,
        upserted: upsertCount,
        skipped: skippedCount
      }
    });
    
  } catch (error) {
    console.error('Error in init:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
