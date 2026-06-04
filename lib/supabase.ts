import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Status = 'ausstehend' | 'zusage' | 'absage'

export interface Bewerbung {
  id: number
  created_at: string
  unternehmen: string | null
  richtung: string
  stadt: string
  datum: string
  status: Status
  link: string | null
  bewerber: string
  von: string
}