import { createClient } from './client';

const USER_ID_KEY = 'hn_recommender_user_id';

export async function ensureAnonymousUser(): Promise<string> {
  if (typeof window === 'undefined') {
    return '';
  }
  
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.error('Error creating anonymous user:', error);
      throw error;
    }
    
    userId = data.user?.id || '';
    
    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId);
    }
  }
  
  return userId;
}

export function getUserId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem(USER_ID_KEY);
}

export function clearUserId(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem(USER_ID_KEY);
}
