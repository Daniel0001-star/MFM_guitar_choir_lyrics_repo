import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase
const supabaseUrl = 'https://ewdlsufzakowsdyozato.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZGxzdWZ6YWtvd3NkeW96YXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODU2MzksImV4cCI6MjA4MTQ2MTYzOX0.jgOTX1NFDL78qx_IZ0G6PQrjRJagW-SJhfAgXX__m78';

export const supabase = createClient(supabaseUrl, supabaseKey);