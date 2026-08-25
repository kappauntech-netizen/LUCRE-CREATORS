import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const requiredDocs = [
  'FILE_TREE.md', 'DATABASE_SCHEMA.md', 'ROUTE_MAP.md', 'COMPONENT_MAP.md',
  'AUTHENTICATION_FLOW.md', 'RBAC_MATRIX.md', 'DESIGN_SYSTEM.md', 'IMPLEMENTATION_SUMMARY.md',
];
requiredDocs.forEach((file) => assert(existsSync(resolve(root, 'docs', file)), `Documento ausente: docs/${file}`));

const roles = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS', 'CREATOR_MANAGER', 'CAMPAIGN_MANAGER', 'FINANCE', 'MODERATOR', 'CREATOR', 'BRAND'];
const permissions = read('features/auth/permissions.ts');
const migrationOne = read('supabase/migrations/0001_foundation.sql');
roles.forEach((role) => {
  assert(permissions.includes(role), `Role ausente da matriz: ${role}`);
  assert(migrationOne.includes(`'${role}'`), `Role ausente do schema: ${role}`);
});

const migrationTwo = read('supabase/migrations/0002_platform_foundation.sql');
[
  'create table public.organizations', 'create table public.organization_memberships',
  'create table public.contracts', 'create table public.matching_results',
  'create table public.rate_limits', 'public.consume_rate_limit',
  'audit_logs_immutable', 'enable row level security',
].forEach((needle) => assert(migrationTwo.includes(needle), `Garantia ausente na migration 0002: ${needle}`));

const migrationThree = read('supabase/migrations/0003_storage_security.sql');
['avatars', 'creator-content', 'brand-assets', 'contracts', 'media-kits'].forEach((bucket) =>
  assert(migrationThree.includes(`'${bucket}'`), `Bucket ausente: ${bucket}`),
);

assert(read('app/app/layout.tsx').includes("requireSurface('creator')"), 'Creator layout sem proteção server-side.');
assert(read('app/brand/layout.tsx').includes("requireSurface('brand')"), 'Brand layout sem proteção server-side.');
assert(read('app/admin/layout.tsx').includes("requireSurface('admin')"), 'Admin layout sem proteção server-side.');
assert(existsSync(resolve(root, 'public', 'lucre-logo.svg')), 'Logo oficial ausente.');
const i18n = read('config/i18n.ts');
['pt-BR', 'pt-PT', 'es', 'en', 'fr', 'it'].forEach((locale) => assert(i18n.includes(`'${locale}'`), `Idioma ausente: ${locale}`));

const trackedText = [read('README.md'), read('.env.example'), read('scripts/seed-admin.mjs')].join('\n');
assert(!trackedText.includes('lucre40302010'), 'Senha exposta encontrada em arquivo versionável.');

if (failures.length) {
  failures.forEach((failure) => process.stderr.write(`✗ ${failure}\n`));
  process.exit(1);
}

process.stdout.write('✓ Foundation estrutural verificada.\n');
