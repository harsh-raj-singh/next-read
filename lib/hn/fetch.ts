import { HNItem } from './types';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

export async function fetchTopStoryIds(): Promise<number[]> {
  const response = await fetch(`${HN_API_BASE}/topstories.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch top stories');
  }
  return response.json();
}

export async function fetchNewStoryIds(): Promise<number[]> {
  const response = await fetch(`${HN_API_BASE}/newstories.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch new stories');
  }
  return response.json();
}

export async function fetchItem(id: number): Promise<HNItem | null> {
  const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export async function fetchItems(ids: number[]): Promise<HNItem[]> {
  const items = await Promise.all(
    ids.map(id => fetchItem(id))
  );
  return items.filter((item): item is HNItem => item !== null);
}

export async function fetchValidStories(count: number = 100): Promise<HNItem[]> {
  const storyIds = await fetchTopStoryIds();
  const idsToFetch = storyIds.slice(0, count);
  
  const items = await fetchItems(idsToFetch);
  
  return items.filter(item =>
    item.type === 'story' &&
    (item.url || item.text) &&
    !item.deleted &&
    !item.dead &&
    item.title
  );
}
