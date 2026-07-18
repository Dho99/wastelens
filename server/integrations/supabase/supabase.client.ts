// Database access is handled through Prisma ORM.
// This module serves as an extension point for future Supabase features
// (e.g. Supabase Auth, Storage, Realtime).
// The actual database connection is configured via DATABASE_URL in .env.

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};
