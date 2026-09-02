-- ============================================================
-- Seed: 5 example gigs in BDT (৳)
-- One per platform + 1 all-in-one bundle
-- Replaces the previous 16-gig seed data
-- Safe to re-run (uses ON CONFLICT)
-- ============================================================

-- Clear existing gig data
DELETE FROM gig_packages;
DELETE FROM gigs;

-- ===================== 5 GIGS =====================

INSERT INTO gigs (slug, platform, title, short_description, full_description, cover_image_url, starting_price, delivery_days, sort_order)
VALUES
  -- 1. YouTube
  ('youtube-growth-pack', 'youtube', 'YouTube Growth Pack',
   'Subscribers, watch time & views to kickstart your channel monetization.',
   'Complete YouTube growth solution designed to help you reach monetization faster. We deliver real-looking subscribers, organic watch hours, and targeted views to boost your channel.\n\n• Safe, gradual delivery\n• Real-looking accounts\n• Works for new and existing channels\n• No password required\n• Results start within 24–48 hours',
   '', 1500, 5, 1),

  -- 2. Facebook
  ('facebook-engagement-pack', 'facebook', 'Facebook Engagement Pack',
   'Followers, page likes & post engagement to grow your Facebook presence.',
   'Grow your Facebook Page or Profile with genuine-looking followers and engagement. Perfect for businesses and creators building an audience in Bangladesh.\n\n• Page followers + post likes\n• Gradual drip delivery\n• Works for Pages and Profiles\n• Safe, no password needed\n• Support for Bengali and English content',
   '', 1200, 4, 2),

  -- 3. Instagram
  ('instagram-boost-pack', 'instagram', 'Instagram Boost Pack',
   'Followers, Reel views & likes to make your profile stand out.',
   'Boost your Instagram presence with real-looking followers and engagement on your Reels and posts. Ideal for influencers, businesses, and personal brands.\n\n• Followers with profile pics\n• Reel views + post likes\n• Gradual, natural delivery\n• No password required\n• Works on Personal, Creator & Business accounts',
   '', 1000, 3, 3),

  -- 4. TikTok
  ('tiktok-viral-pack', 'tiktok', 'TikTok Viral Pack',
   'Followers, views & likes to push your videos to the For You page.',
   'Get your TikTok content in front of more people. We deliver followers, video views, and engagement that helps trigger TikTok''s algorithm to push your content on the For You page.\n\n• Real-looking followers\n• Video views with retention\n• Likes and comments\n• Helps trigger FYP algorithm\n• Safe for any TikTok account',
   '', 800, 2, 4),

  -- 5. All-in-One
  ('all-in-one-social-pack', 'youtube', 'All-in-One Social Media Pack',
   'Grow on YouTube, Facebook, Instagram & TikTok with one powerful bundle.',
   'Our all-in-one package covers all four major platforms — YouTube, Facebook, Instagram, and TikTok. Perfect for brands and creators who want a unified social media presence across every channel.\n\n• YouTube: subscribers + views\n• Facebook: followers + engagement\n• Instagram: followers + Reel views\n• TikTok: followers + video views\n• Coordinated delivery across all platforms\n• Dedicated support throughout\n• Progress report after completion',
   '', 3500, 7, 5)

ON CONFLICT (slug) DO NOTHING;

-- ===================== PACKAGES (3 tiers each) =====================

DO $$
DECLARE
  gig RECORD;
BEGIN
  FOR gig IN SELECT id, slug, platform, starting_price, delivery_days FROM gigs ORDER BY sort_order
  LOOP
    -- Basic tier (1x)
    INSERT INTO gig_packages (gig_id, tier, name, price, delivery_days, features, sort_order)
    VALUES (
      gig.id, 'basic', 'Basic',
      gig.starting_price,
      gig.delivery_days,
      CASE
        WHEN gig.slug = 'youtube-growth-pack' THEN
          '["1,000 subscribers", "500 views", "Standard delivery", "Email updates"]'::jsonb
        WHEN gig.slug = 'facebook-engagement-pack' THEN
          '["500 page followers", "200 post likes", "Standard delivery", "Email updates"]'::jsonb
        WHEN gig.slug = 'instagram-boost-pack' THEN
          '["500 followers", "1,000 Reel views", "Fast delivery", "Email updates"]'::jsonb
        WHEN gig.slug = 'tiktok-viral-pack' THEN
          '["500 followers", "5,000 video views", "Fast delivery", "Email updates"]'::jsonb
        WHEN gig.slug = 'all-in-one-social-pack' THEN
          '["YouTube: 500 subs + 1K views", "FB: 300 followers", "IG: 300 followers + 500 Reel views", "TikTok: 300 followers + 3K views", "Email updates"]'::jsonb
        ELSE '["Standard delivery", "Email updates"]'::jsonb
      END,
      0
    ) ON CONFLICT DO NOTHING;

    -- Standard tier (2x)
    INSERT INTO gig_packages (gig_id, tier, name, price, delivery_days, features, sort_order)
    VALUES (
      gig.id, 'standard', 'Standard',
      ROUND(gig.starting_price * 2, 0),
      gig.delivery_days + 3,
      CASE
        WHEN gig.slug = 'youtube-growth-pack' THEN
          '["3,000 subscribers", "2,000 views", "100 likes", "Priority delivery", "Chat support", "Drip-feed"]'::jsonb
        WHEN gig.slug = 'facebook-engagement-pack' THEN
          '["1,500 page followers", "500 post likes", "100 comments", "Priority delivery", "Chat support", "Drip-feed"]'::jsonb
        WHEN gig.slug = 'instagram-boost-pack' THEN
          '["1,500 followers", "3,000 Reel views", "200 likes", "Priority delivery", "Chat support", "Drip-feed"]'::jsonb
        WHEN gig.slug = 'tiktok-viral-pack' THEN
          '["1,500 followers", "15,000 video views", "300 likes", "Priority delivery", "Chat support", "Drip-feed"]'::jsonb
        WHEN gig.slug = 'all-in-one-social-pack' THEN
          '["YouTube: 2K subs + 5K views + 100 likes", "FB: 1K followers + 300 likes", "IG: 1K followers + 2K Reel views", "TikTok: 1K followers + 10K views", "Priority delivery", "Chat support"]'::jsonb
        ELSE '["Priority delivery", "Chat support", "Drip-feed"]'::jsonb
      END,
      1
    ) ON CONFLICT DO NOTHING;

    -- Premium tier (4x)
    INSERT INTO gig_packages (gig_id, tier, name, price, delivery_days, features, sort_order)
    VALUES (
      gig.id, 'premium', 'Premium',
      ROUND(gig.starting_price * 4, 0),
      gig.delivery_days + 7,
      CASE
        WHEN gig.slug = 'youtube-growth-pack' THEN
          '["5,000 subscribers", "5,000 views", "300 likes + 50 comments", "Express delivery", "Priority support", "Unlimited revisions", "Detailed progress report"]'::jsonb
        WHEN gig.slug = 'facebook-engagement-pack' THEN
          '["3,000 page followers", "1,000 post likes", "300 comments", "Express delivery", "Priority support", "Unlimited revisions", "Detailed progress report"]'::jsonb
        WHEN gig.slug = 'instagram-boost-pack' THEN
          '["3,000 followers", "8,000 Reel views", "500 likes + 100 comments", "Express delivery", "Priority support", "Unlimited revisions", "Detailed progress report"]'::jsonb
        WHEN gig.slug = 'tiktok-viral-pack' THEN
          '["3,000 followers", "50,000 video views", "1,000 likes + 200 comments", "Express delivery", "Priority support", "Unlimited revisions", "Detailed progress report"]'::jsonb
        WHEN gig.slug = 'all-in-one-social-pack' THEN
          '["YouTube: 5K subs + 15K views + 300 likes", "FB: 3K followers + 1K likes + 300 comments", "IG: 3K followers + 8K Reel views + 500 likes", "TikTok: 3K followers + 50K views + 1K likes", "Express delivery", "Priority support", "Full progress report"]'::jsonb
        ELSE '["Express delivery", "Priority support", "Unlimited revisions", "Detailed progress report"]'::jsonb
      END,
      2
    ) ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
