import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase
// PROJECT ID: ewdlsufzakowsdyozato
const supabaseUrl = 'https://ewdlsufzakowsdyozato.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZGxzdWZ6YWtvd3NkeW96YXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODU2MzksImV4cCI6MjA4MTQ2MTYzOX0.jgOTX1NFDL78qx_IZ0G6PQrjRJagW-SJhfAgXX__m78';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * ATTENTION: If you see "Could not find the table 'public.songs'", 
 * please run the following SQL in your Supabase SQL Editor:
 * 
 * create table songs (
 *   id uuid default gen_random_uuid() primary key,
 *   title text not null,
 *   composer text default 'MFM Guitar Choir',
 *   arranger text,
 *   difficulty text,
 *   key text,
 *   "coverUrl" text,
 *   "youtubeUrl" text,
 *   "spotifyUrl" text,
 *   "audioUrl" text,
 *   lyrics text,
 *   "uploadDate" timestamp with time zone default now()
 * );
 * 
 * -- Enable public access (Read/Write) for the demo
 * alter table songs enable row level security;
 * create policy "Public Read" on songs for select using (true);
 * create policy "Public Insert" on songs for insert with check (true);
 */
