-- Sample data for local development of the single-company Agency OS.
-- Run after the initial migration: `supabase db reset` applies this automatically,
-- or `psql "$DATABASE_URL" -f supabase/seed.sql`.

insert into public.clients (id, name, industry, brand_color, contacts) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Luminary Brands',
    'Fashion & Apparel',
    '#6B21E8',
    '[{"name":"Ava Chen","role":"Brand Director","email":"ava@luminary.com"},
      {"name":"Marcus Reid","role":"Marketing Lead","email":"marcus@luminary.com"}]'::jsonb
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Northwind Coffee',
    'Food & Beverage',
    '#0F766E',
    '[{"name":"Priya Patel","role":"Founder","email":"priya@northwind.co"}]'::jsonb
  )
on conflict (id) do nothing;

insert into public.campaigns (id, client_id, name, status, description, start_date, end_date) values
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Summer Drop 2025',
    'active',
    'Seasonal launch campaign across paid social and email.',
    '2025-05-01',
    '2025-08-31'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'Cold Brew Relaunch',
    'active',
    'Reposition the cold brew line for summer.',
    '2025-06-01',
    '2025-07-31'
  )
on conflict (id) do nothing;

insert into public.assets
  (id, client_id, campaign_id, name, type, status, priority, current_version, revision_count, due_date, description) values
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Hero Banner — Homepage',
    'image',
    'client_review',
    'high',
    2,
    1,
    '2025-06-20',
    'Primary hero for the Summer Drop landing page.'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Launch Email Copy',
    'copy',
    'approved',
    'medium',
    3,
    2,
    '2025-06-15',
    'Announcement email for the Summer Drop.'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-0000-0000-0000-000000000002',
    '15s Cold Brew Promo',
    'video',
    'internal_review',
    'high',
    1,
    0,
    '2025-06-28',
    'Short-form vertical video for paid social.'
  )
on conflict (id) do nothing;

insert into public.brand_kits
  (client_id, name, primary_colors, fonts, logos, voice, guidelines) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Luminary Brand Kit',
    '[{"name":"Primary Purple","hex":"#6B21E8","usage":"CTA, links, primary actions"},
      {"name":"Deep Indigo","hex":"#1E1B4B","usage":"Backgrounds, dark surfaces"},
      {"name":"Warm White","hex":"#FAFAF9","usage":"Page backgrounds"}]'::jsonb,
    '[{"name":"Bricolage Grotesque","weights":["400","600","700"],"usage":"Headings","sample":"Summer Drop 2025"},
      {"name":"Inter","weights":["400","500"],"usage":"Body copy","sample":"Premium fashion for the discerning few."}]'::jsonb,
    '[{"name":"Primary Lockup","variant":"Dark Background","bg":"#1E1B4B"},
      {"name":"Icon Mark","variant":"Purple","bg":"#6B21E8"}]'::jsonb,
    '[{"principle":"Confident","description":"We speak with authority, never arrogance."},
      {"principle":"Editorial","description":"Closer to a fashion magazine than a retailer."}]'::jsonb,
    '["Minimum logo clearspace equals the height of the L on all sides.",
      "Never stretch or distort the logo.",
      "Photography must use natural light."]'::jsonb
  )
on conflict (client_id) do nothing;
