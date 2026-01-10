import natural from 'natural';
import { TFIDFVector } from '../hn/types';

const TfIdf = natural.TfIdf;
const WordTokenizer = natural.WordTokenizer;

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
  'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
  'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they',
  'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
  'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
  'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just',
  'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good',
  'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
  'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
  'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been', 'has',
  'had', 'for', 'was', 'does', 'did', 'having', 'll', 've', 're', 'd'
]);

export function preprocessText(text: string): string[] {
  const tokenizer = new WordTokenizer();
  
  let tokens = tokenizer.tokenize(text.toLowerCase()) || [];
  
  tokens = tokens.filter(token =>
    !STOP_WORDS.has(token) &&
    token.length > 2 &&
    /^[a-z0-9\-]+$/.test(token)
  );
  
  return tokens;
}

export function computeTFIDF(text: string): TFIDFVector {
  const tfidf = new TfIdf();
  tfidf.addDocument(text);
  
  const terms: string[] = [];
  const scores: number[] = [];
  
  const list = tfidf.listTerms(0);
  if (!list || list.length === 0) {
    return { terms: [], scores: [], magnitude: 0 };
  }
  
  list.forEach((termObj: any) => {
    terms.push(termObj.term);
    scores.push(termObj.tfidf);
  });
  
  const magnitude = Math.sqrt(scores.reduce((sum, score) => sum + score * score, 0));
  
  return { terms, scores, magnitude };
}

export function extractContent(title: string, textContent: string = ''): string {
  return `${title} ${textContent}`.trim();
}
