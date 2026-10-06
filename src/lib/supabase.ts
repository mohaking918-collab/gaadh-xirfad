import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Course, Enrollment, EnrollmentStatus, Profile } from '../types';
import { INITIAL_COURSES, INITIAL_ENROLLMENTS } from '../data/initialCourses';

// Admin email as specified in project mission
export const ADMIN_EMAIL = 'mohaking918@gmail.com';
export const MERCHANT_PHONE = '+252 676863923';

// Storage keys
const LOCAL_COURSES_KEY = 'gaadh_xirfad_courses';
const LOCAL_ENROLLMENTS_KEY = 'gaadh_xirfad_enrollments';
const LOCAL_AUTH_USER_KEY = 'gaadh_xirfad_active_user';
const CONFIG_KEY = 'gaadh_xirfad_supabase_config';

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

function sanitizeSupabaseUrl(url: string): string {
  let cleaned = (url || '').trim();
  if (cleaned.endsWith('/rest/v1/')) cleaned = cleaned.replace('/rest/v1/', '');
  if (cleaned.endsWith('/rest/v1')) cleaned = cleaned.replace('/rest/v1', '');
  if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  return cleaned;
}

export function getStoredConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && !envUrl.includes('your-project-id')) {
    return { url: sanitizeSupabaseUrl(envUrl), anonKey: envKey.trim() };
  }

  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        return { url: sanitizeSupabaseUrl(parsed.url), anonKey: parsed.anonKey.trim() };
      }
    }
  } catch {
    // Ignore parse errors
  }

  return { url: '', anonKey: '' };
}

export function saveStoredConfig(url: string, anonKey: string) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: sanitizeSupabaseUrl(url), anonKey: anonKey.trim() }));
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredConfig();
  if (!url || !anonKey || url.includes('your-project-id')) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  return getSupabase() !== null;
}

// ---------------- LOCAL DATABASE HELPERS (Fallback & Instant Demo) ----------------
function getLocalCourses(): Course[] {
  try {
    const raw = localStorage.getItem(LOCAL_COURSES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
  return INITIAL_COURSES;
}

function saveLocalCourses(courses: Course[]) {
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
}

function getLocalEnrollments(): Enrollment[] {
  try {
    const raw = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(INITIAL_ENROLLMENTS));
  return INITIAL_ENROLLMENTS;
}

function saveLocalEnrollments(enrollments: Enrollment[]) {
  localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(enrollments));
}

// ---------------- API SERVICES ----------------

export async function fetchCourses(): Promise<Course[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Course[];
      }
    } catch (e) {
      console.warn('Supabase fetchCourses failed, falling back to local data:', e);
    }
  }
  return getLocalCourses();
}

export async function createCourse(newCourse: Omit<Course, 'id'>): Promise<Course> {
  const courseWithId: Course = {
    ...newCourse,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };

  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('courses')
        .insert([courseWithId])
        .select()
        .single();
      if (!error && data) return data as Course;
    } catch (e) {
      console.warn('Supabase createCourse error:', e);
    }
  }

  const courses = getLocalCourses();
  courses.unshift(courseWithId);
  saveLocalCourses(courses);
  return courseWithId;
}

export async function fetchEnrollments(userEmail?: string, isAdmin: boolean = false): Promise<Enrollment[]> {
  const client = getSupabase();
  if (client) {
    try {
      let query = client.from('enrollments').select('*').order('created_at', { ascending: false });
      if (!isAdmin && userEmail) {
        query = query.eq('student_email', userEmail);
      }
      const { data, error } = await query;
      if (!error && data) return data as Enrollment[];
    } catch (e) {
      console.warn('Supabase fetchEnrollments error:', e);
    }
  }

  const local = getLocalEnrollments();
  if (isAdmin) {
    return local;
  }
  if (userEmail) {
    return local.filter(e => e.student_email.toLowerCase() === userEmail.toLowerCase());
  }
  return [];
}

export async function createEnrollment(enrollmentData: {
  user_id?: string;
  course_id: string;
  student_name: string;
  student_email: string;
  course_title: string;
  amount: number;
  payment_method: 'Zaad' | 'EVC Plus' | 'Sahal';
  sender_number: string;
  transaction_id?: string;
}): Promise<Enrollment> {
  const newEnrollment: Enrollment = {
    id: 'ord-' + Math.floor(100000 + Math.random() * 900000),
    user_id: enrollmentData.user_id || 'guest-' + Date.now(),
    course_id: enrollmentData.course_id,
    student_name: enrollmentData.student_name,
    student_email: enrollmentData.student_email,
    course_title: enrollmentData.course_title,
    amount: enrollmentData.amount,
    payment_method: enrollmentData.payment_method,
    sender_number: enrollmentData.sender_number,
    transaction_id: enrollmentData.transaction_id || undefined,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('enrollments')
        .insert([newEnrollment])
        .select()
        .single();
      if (!error && data) return data as Enrollment;
    } catch (e) {
      console.warn('Supabase createEnrollment fallback:', e);
    }
  }

  const list = getLocalEnrollments();
  list.unshift(newEnrollment);
  saveLocalEnrollments(list);
  return newEnrollment;
}

export async function updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<boolean> {
  const client = getSupabase();
  if (client) {
    try {
      const { error } = await client
        .from('enrollments')
        .update({ status })
        .eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase updateEnrollmentStatus error:', e);
    }
  }

  const list = getLocalEnrollments();
  const index = list.findIndex(e => e.id === id);
  if (index !== -1) {
    list[index].status = status;
    saveLocalEnrollments(list);
    return true;
  }
  return false;
}

// ---------------- AUTH SERVICES ----------------

export async function signInWithGoogle() {
  const client = getSupabase();
  if (client) {
    return await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
  }
  return { data: null, error: new Error('Supabase URL not configured. Use demo login or configure Supabase keys.') };
}

export function getActiveMockUser(): Profile | null {
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
}

export function setActiveMockUser(user: Profile | null) {
  if (user) {
    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_AUTH_USER_KEY);
  }
}
