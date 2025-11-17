import { createClient } from '@supabase/supabase-js'

// 🔑 Paste your details from Step 2
const supabaseUrl = 'https://qjsvyklowjdjvrpiuyua.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3Z5a2xvd2pkanZycGl1eXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDgyOTgsImV4cCI6MjA3ODYyNDI5OH0.lZFEHSCs99_0SewKI8CgS8FOjFEvwQaYxdV3Ah-f3h8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
