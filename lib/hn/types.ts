export interface HNItem {
  id: number;
  by: string;
  time: number;
  title?: string;
  url?: string;
  text?: string;
  score?: number;
  type: 'story' | 'comment' | 'job' | 'poll' | 'pollopt';
  descendants?: number;
  deleted?: boolean;
  dead?: boolean;
}

export interface Article {
  id: number;
  title: string;
  url: string | null;
  text_content: string;
  author: string;
  score: number;
  time: number;
  type: string;
  descendants: number;
  fetched_at: string;
  tfidf_vector: TFIDFVector | null;
  tags: string[];
}

export interface TFIDFVector {
  terms: string[];
  scores: number[];
  magnitude: number;
}

export interface Interaction {
  id: string;
  user_id: string;
  article_id: number;
  liked: boolean | null;
  disliked: boolean | null;
  rating: number | null;
  visit_count: number;
  last_visited: string;
  first_visited: string;
}

export interface Recommendation {
  article: Article;
  contentScore: number;
  collabScore: number;
  finalScore: number;
  reason: string;
}
