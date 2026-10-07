import { supabase, hasSupabase } from './supabase';
import { defaultQuestions, defaultAircraftEntries } from './mockData';

/**
 * Sign up a new user
 * @param {string} email
 * @param {string} password
 * @param {string} nickname
 * @returns {Promise<{user, session, error}>}
 */
export async function signUp(email, password, nickname) {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  // Create profile
  const isAdmin = nickname.toLowerCase().includes('admin') || email.toLowerCase().includes('admin');
  
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: data.user.id,
        email,
        nickname,
        role: isAdmin ? 'admin' : 'user'
      }
    ]);

  if (profileError) throw profileError;

  return { user: data.user, session: data.session };
}

/**
 * Sign in user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user, session, error}>}
 */
export async function signIn(email, password) {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return { user: data.user, session: data.session };
}

/**
 * Sign out user
 */
export async function signOut() {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current session
 * @returns {Promise<{data, error}>}
 */
export async function getSession() {
  if (!hasSupabase()) {
    return { data: null, error: 'Supabase not configured' };
  }

  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

/**
 * Get user profile
 * @param {string} userId
 * @returns {Promise<{data, error}>}
 */
export async function getUserProfile(userId) {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

/**
 * Get published questions
 * @returns {Promise<{data, error}>}
 */
export async function getPublishedQuestions() {
  if (!hasSupabase()) {
    // Return mock data if Supabase not configured
    return { data: defaultQuestions.filter(q => q.published), error: null };
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Get all questions (admin only)
 * @returns {Promise<{data, error}>}
 */
export async function getAllQuestions() {
  if (!hasSupabase()) {
    return { data: defaultQuestions, error: null };
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Save question (create or update)
 * @param {Question} question
 * @returns {Promise<{data, error}>}
 */
export async function saveQuestion(question) {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('questions')
    .upsert(question, { onConflict: 'id' })
    .select()
    .single();

  return { data, error };
}

/**
 * Delete question
 * @param {string} questionId
 * @returns {Promise<{error}>}
 */
export async function deleteQuestion(questionId) {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId);

  return { error };
}

/**
 * Save quiz attempt
 * @param {QuizAttempt} attempt
 * @returns {Promise<{data, error}>}
 */
export async function saveQuizAttempt(attempt) {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert([attempt])
    .select()
    .single();

  return { data, error };
}

/**
 * Get user's quiz attempts
 * @param {string} userId
 * @returns {Promise<{data, error}>}
 */
export async function getUserAttempts(userId) {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Get leaderboard
 * @returns {Promise<{data, error}>}
 */
export async function getLeaderboard() {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.rpc('get_leaderboard');
  return { data, error };
}

/**
 * Upload image to Supabase Storage
 * @param {File} file
 * @param {string} bucket
 * @returns {Promise<{url, error}>}
 */
export async function uploadImage(file, bucket = 'aircraft-photos') {
  if (!hasSupabase()) {
    throw new Error('Supabase not configured');
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (uploadError) {
    return { url: null, error: uploadError };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

/**
 * Get encyclopedia entries
 * @returns {Promise<{data, error}>}
 */
export async function getEncyclopedia() {
  if (!hasSupabase()) {
    return { data: defaultAircraftEntries, error: null };
  }

  const { data, error } = await supabase
    .from('aircraft_encyclopedia')
    .select('*')
    .order('category', { ascending: true });

  return { data, error };
}
