// src/supabase.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://axfdwspleycnabtaxvet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZmR3c3BsZXljbmFidGF4dmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTE0NTgsImV4cCI6MjA3ODEyNzQ1OH0.ULfhImgKXws_72XgdimOl0boEvdDvdee2qPpxRoUDJ0';
export const supabase = createClient(supabaseUrl, supabaseKey);