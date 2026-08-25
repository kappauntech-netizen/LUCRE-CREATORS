import { createClient } from '@supabase/supabase-js';

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_LOGIN_EMAIL',
  'ADMIN_INITIAL_PASSWORD',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Variáveis ausentes: ${missing.join(', ')}`);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const email = process.env.ADMIN_LOGIN_EMAIL.toLowerCase();
const password = process.env.ADMIN_INITIAL_PASSWORD;
const username = process.env.ADMIN_LOGIN_USERNAME || 'lucre';

const { data: created, error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: 'Lucre Admin' },
});

let user = created?.user;
if (createError) {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;
  user = users.users.find((candidate) => candidate.email?.toLowerCase() === email);
  if (!user) throw createError;
}

const { error: profileError } = await supabase.from('profiles').upsert({
  id: user.id,
  username,
  full_name: 'Lucre Admin',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
});

if (profileError) throw profileError;

const { data: organization, error: organizationError } = await supabase
  .from('organizations')
  .upsert({ name: 'Lucre Operations', slug: 'lucre-operations', type: 'LUCRE', status: 'ACTIVE' }, { onConflict: 'slug' })
  .select('id')
  .single();

if (organizationError) throw organizationError;

const { error: membershipError } = await supabase.from('organization_memberships').upsert({
  organization_id: organization.id,
  profile_id: user.id,
  member_role: 'OWNER',
  status: 'ACTIVE',
}, { onConflict: 'organization_id,profile_id' });

if (membershipError) throw membershipError;
console.log(`Administrador ${username} e organização Lucre Operations criados/atualizados com segurança.`);
