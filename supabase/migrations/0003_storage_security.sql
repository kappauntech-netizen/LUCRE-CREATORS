-- Lucre Creators · Supabase Storage foundation

create or replace function public.safe_uuid(value text)
returns uuid language plpgsql immutable as $$
begin
  return value::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('creator-content', 'creator-content', false, 524288000, array['image/jpeg','image/png','image/webp','video/mp4','video/quicktime']),
  ('brand-assets', 'brand-assets', false, 52428800, array['image/jpeg','image/png','image/webp','application/pdf']),
  ('contracts', 'contracts', false, 20971520, array['application/pdf']),
  ('media-kits', 'media-kits', true, 20971520, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy avatars_public_read on storage.objects for select using (bucket_id = 'avatars');
create policy avatars_owner_insert on storage.objects for insert with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy avatars_owner_update on storage.objects for update using (
  bucket_id = 'avatars' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_lucre_team())
);
create policy avatars_owner_delete on storage.objects for delete using (
  bucket_id = 'avatars' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_lucre_team())
);

create policy creator_content_owner_read on storage.objects for select using (
  bucket_id = 'creator-content'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_lucre_team())
);
create policy creator_content_owner_insert on storage.objects for insert with check (
  bucket_id = 'creator-content' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy creator_content_owner_update on storage.objects for update using (
  bucket_id = 'creator-content'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_lucre_team())
);

create policy brand_assets_tenant_read on storage.objects for select using (
  bucket_id = 'brand-assets'
  and public.is_organization_member(public.safe_uuid((storage.foldername(name))[1]))
);
create policy brand_assets_tenant_insert on storage.objects for insert with check (
  bucket_id = 'brand-assets'
  and public.is_organization_manager(public.safe_uuid((storage.foldername(name))[1]))
);
create policy brand_assets_tenant_update on storage.objects for update using (
  bucket_id = 'brand-assets'
  and public.is_organization_manager(public.safe_uuid((storage.foldername(name))[1]))
);

create policy contracts_participant_read on storage.objects for select using (
  bucket_id = 'contracts'
  and (public.is_organization_member(public.safe_uuid((storage.foldername(name))[1])) or public.is_lucre_team())
);

create policy media_kits_public_read on storage.objects for select using (bucket_id = 'media-kits');
create policy media_kits_owner_insert on storage.objects for insert with check (
  bucket_id = 'media-kits' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy media_kits_owner_update on storage.objects for update using (
  bucket_id = 'media-kits'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_lucre_team())
);

-- Uploads de contratos são feitos somente por serviços backend após autorização.
