import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [key, val] = line.split('=');
  if (key) acc[key.trim()] = val.trim();
  return acc;
}, {});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_PUBLISHABLE_KEY']);
async function run() {
  const { data: roles } = await supabase.from('user_roles').select('user_id, role');
  console.log('Roles:', roles);
  const { data: profs } = await supabase.from('profiles').select('user_id, first_name');
  console.log('Profiles:', profs);
}
run();
