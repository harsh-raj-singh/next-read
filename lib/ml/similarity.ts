import { TFIDFVector } from '../hn/types';

export function cosineSimilarity(vec1: TFIDFVector, vec2: TFIDFVector): number {
  if (vec1.magnitude === 0 || vec2.magnitude === 0) {
    return 0;
  }
  
  const commonTerms = vec1.terms.filter(term => vec2.terms.includes(term));
  
  if (commonTerms.length === 0) {
    return 0;
  }
  
  let dotProduct = 0;
  commonTerms.forEach(term => {
    const index1 = vec1.terms.indexOf(term);
    const index2 = vec2.terms.indexOf(term);
    const score1 = vec1.scores[index1];
    const score2 = vec2.scores[index2];
    dotProduct += score1 * score2;
  });
  
  const cosineSim = dotProduct / (vec1.magnitude * vec2.magnitude);
  
  return Math.min(1, Math.max(0, cosineSim));
}

export function computeContentScore(
  userPreferences: TFIDFVector,
  articleVector: TFIDFVector
): number {
  return cosineSimilarity(userPreferences, articleVector);
}
