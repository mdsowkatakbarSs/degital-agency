-- ============================================================
-- Add YouTube Monetization Support Package
-- Single-package gig (tier: standard only)
-- ============================================================

INSERT INTO gigs (slug, platform, title, short_description, full_description, cover_image_url, starting_price, delivery_days, is_active, sort_order)
VALUES (
  'youtube-monetization-support', 'youtube',
  'YouTube Monetization Support Package',
  'Complete, done-for-you path to YouTube monetization — subscribers, watch hours & AdSense support in one package.',
  'End-to-end monetization support for your YouTube channel. We help you reach the subscriber and watch-hour thresholds with 100% real, active audience — no bots, no fake activity — then guide you through AdSense account setup and the full YouTube Partner Program (YPP) application until you''re approved.',
  '/gigs/youtube-monetization-support.jpg', 50, 15, true,
  (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM gigs)
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO gig_packages (gig_id, tier, name, price, delivery_days, features, sort_order)
SELECT id, 'standard', 'Complete Monetization Package', 50, 15,
  '["1,000 Real Subscribers (100% Real & Active, No Bots)", "4,000 Watch Hours (Organic & Safe)", "Complete Monetization Support", "AdSense Account Assistance", "YouTube Partner Program (YPP) Guidance", "Safe & Professional Service"]'::jsonb,
  0
FROM gigs WHERE slug = 'youtube-monetization-support'
ON CONFLICT DO NOTHING;
