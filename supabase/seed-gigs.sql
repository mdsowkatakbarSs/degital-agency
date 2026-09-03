-- ============================================================
-- Seed: 16 gigs × 3 packages each
-- Run AFTER 003_gigs_schema.sql has been applied
-- ============================================================

-- Helper: we'll insert gigs first, then packages
-- Using ON CONFLICT DO NOTHING so this is safe to re-run

-- ===================== YOUTUBE =====================

INSERT INTO gigs (slug, platform, title, short_description, full_description, cover_image_url, starting_price, delivery_days, sort_order)
VALUES
  ('youtube-monetization-package', 'youtube', 'YouTube Monetization Package',
   'Complete monetization setup — subscribers, watch time & engagement boost to unlock YouTube Partner Program.',
   'Our YouTube Monetization Package is a comprehensive growth solution designed to help you meet the YouTube Partner Program requirements. We combine real subscriber growth, watch time enhancement, and engagement boosting to get your channel monetization-ready.\n\n• Safe, organic-style delivery methods\n• gradual drip-feed to look natural\n• Dedicated support throughout the process\n• Results typically visible within 1–2 weeks',
   '', 49.99, 7, 1),

  ('youtube-subscribers', 'youtube', 'YouTube Subscribers',
   'Grow your subscriber count with real, high-quality accounts that stick.',
   'Boost your YouTube channel credibility with genuine-looking subscriber growth. Our subscribers come from real-looking accounts and are delivered gradually to maintain authenticity.\n\n• Real-looking profile pictures & activity\n• Gradual drip delivery\n• High retention rate\n• No password or channel access required',
   '', 19.99, 5, 2),

  ('youtube-watch-time', 'youtube', 'YouTube Watch Time',
   'Get authentic watch hours to meet the 4,000-hour monetization threshold.',
   'Watch time is one of the hardest metrics to build organically. Our service delivers real watch hours through targeted views that count toward your monetization requirements.\n\n• Hours count toward YPP threshold\n• Targeted, niche-relevant views\n• Gradual delivery over days\n• Safe for your channel',
   '', 29.99, 10, 3),

  ('youtube-views', 'youtube', 'YouTube Views',
   'Increase your video views to boost visibility and algorithmic reach.',
   'More views mean better algorithmic ranking and social proof. Our view service delivers real-looking views that help your content get discovered by a wider audience.\n\n• Real-looking views with retention\n• Helps boost algorithmic recommendation\n• Safe, white-hat methods\n• Works on any video or Short',
   '', 9.99, 3, 4),

  ('youtube-like-comment', 'youtube', 'YouTube Like/Comment',
   'Boost engagement with real likes and custom comments on your videos.',
   'Engagement signals are crucial for YouTube''s algorithm. We deliver real-looking likes and thoughtful, relevant comments to boost your videos'' performance and social proof.\n\n• Mix of likes and custom comments\n• Niche-relevant engagement\n• Gradual, natural-looking delivery\n• Helps improve video ranking',
   '', 14.99, 3, 5),

-- ===================== FACEBOOK =====================

  ('facebook-monetization-package', 'facebook', 'Facebook Monetization Package',
   'Full monetization boost — followers, engagement & views to unlock Facebook stars and bonuses.',
   'Our Facebook Monetization Package helps you meet the eligibility requirements for Facebook''s monetization features including Stars, In-Stream Ads, and bonus programs.\n\n• Follower growth + engagement boost\n• Meets eligibility thresholds\n• Safe, platform-friendly methods\n• Support for Pages and Profiles',
   '', 39.99, 7, 6),

  ('facebook-followers', 'facebook', 'Facebook Profile/Page Followers',
   'Build your Facebook audience with real-looking followers for pages and profiles.',
   'A larger follower base gives your content more reach and credibility. We deliver real-looking followers to your Facebook Page or Profile.\n\n• Works for both Pages and Profiles\n• Real-looking accounts\n• Gradual delivery\n• No password or admin access needed',
   '', 14.99, 5, 7),

  ('facebook-views', 'facebook', 'Facebook Views',
   'Increase video views on Facebook to boost reach and algorithmic distribution.',
   'Get more eyes on your Facebook videos. Our view service helps boost your content''s visibility and social proof.\n\n• Real-looking view counts\n• Helps with algorithmic ranking\n• Works on Reels, Lives, and standard videos\n• Safe delivery methods',
   '', 9.99, 3, 8),

  ('facebook-like-comments', 'facebook', 'Facebook Like/Comments',
   'Boost post engagement with real-looking likes and comments on Facebook.',
   'Engagement drives reach on Facebook. We deliver likes and relevant comments to boost your posts'' performance in the algorithm.\n\n• Mix of likes and comments\n• Relevant, natural-sounding comments\n• Helps improve organic reach\n• Safe for your account',
   '', 12.99, 3, 9),

  ('facebook-review', 'facebook', 'Facebook Review',
   'Get positive reviews and ratings on your Facebook business page to build trust.',
   'Positive reviews are social proof gold for businesses. We help you build a strong review profile on your Facebook Page.\n\n• Realistic review profiles\n• Gradual posting schedule\n• Natural-sounding reviews\n• Boosts local search visibility',
   '', 19.99, 7, 10),

-- ===================== INSTAGRAM =====================

  ('instagram-followers', 'instagram', 'Instagram Followers',
   'Grow your Instagram following with real-looking, high-quality accounts.',
   'Build your Instagram presence with genuine-looking follower growth. Our followers have profile pictures, posts, and activity that make them look authentic.\n\n• Real-looking accounts with activity\n• Gradual drip delivery\n• No password required\n• Works for Personal, Creator, and Business accounts',
   '', 14.99, 3, 11),

  ('instagram-views', 'instagram', 'Instagram Views',
   'Boost your Reel and Story views to increase visibility and social proof.',
   'More views on your Reels and Stories help you reach the Explore page and gain new followers organically.\n\n• Works on Reels, Stories, and IGTV\n• Helps with Explore page ranking\n• Real-looking view counts\n• Safe delivery methods',
   '', 7.99, 2, 12),

  ('instagram-like-comments', 'instagram', 'Instagram Like/Comments',
   'Increase engagement on your posts with real-looking likes and relevant comments.',
   'Instagram''s algorithm favors posts with high engagement. We deliver likes and comments to boost your posts'' visibility.\n\n• Natural-looking engagement mix\n• Relevant, niche-appropriate comments\n• Helps improve post ranking\n• Safe for your account',
   '', 11.99, 2, 13),

-- ===================== TIKTOK =====================

  ('tiktok-followers', 'tiktok', 'TikTok Followers',
   'Grow your TikTok audience with real-looking followers to boost your profile credibility.',
   'Build a strong TikTok following with genuine-looking followers. More followers mean more social proof and better chances of going viral.\n\n• Real-looking accounts with profile pics\n• Gradual, natural delivery\n• No password required\n• Works for any TikTok account',
   '', 12.99, 3, 14),

  ('tiktok-views', 'tiktok', 'TikTok Views',
   'Boost your video views to trigger TikTok''s algorithm and reach the For You page.',
   'TikTok''s algorithm favors videos with strong initial view counts. Our view service helps your content get picked up and pushed to the For You page.\n\n• Helps trigger FYP algorithm\n• Real-looking view counts\n• Gradual delivery\n• Works on any TikTok video',
   '', 6.99, 2, 15),

  ('tiktok-like-comments', 'tiktok', 'TikTok Like/Comments',
   'Increase engagement on your TikTok videos with real-looking likes and comments.',
   'Engagement is king on TikTok. We deliver likes and comments that boost your videos'' performance and help them reach a wider audience.\n\n• Mix of likes and comments\n• Natural-looking engagement\n• Helps with algorithmic ranking\n• Safe for your account',
   '', 9.99, 2, 16)

ON CONFLICT (slug) DO NOTHING;

-- Now insert packages for each gig
-- Using a DO block with a cursor to handle this cleanly

DO $$
DECLARE
  gig RECORD;
BEGIN
  FOR gig IN SELECT id, slug, platform, starting_price, delivery_days FROM gigs ORDER BY sort_order
  LOOP
    -- Basic tier: ~1x starting price
    INSERT INTO gig_packages (gig_id, tier, name, price, delivery_days, features, sort_order)
    VALUES (
      gig.id, 'basic', 'Basic',
      gig.starting_price,
      CASE
        WHEN gig.delivery_days <= 2 THEN 2
        WHEN gig.delivery_days <= 5 THEN 5
        ELSE 7
      END,
      CASE gig.platform
        WHEN 'youtube' THEN '["Standard delivery", "Email updates", "1 revision"]'::jsonb
        WHEN 'facebook' THEN '["Standard delivery", "Email updates", "1 revision"]'::jsonb
        WHEN 'instagram' THEN '["Fast delivery", "Email updates", "1 revision"]'::jsonb
        WHEN 'tiktok' THEN '["Fast delivery", "Email updates", "1 revision"]'::jsonb
      END,
      0
    )
    ON CONFLICT DO NOTHING;

    -- Standard tier: ~2x starting price
    INSERT INTO gig_packages (gig_id, tier, name, price, delivery_days, features, sort_order)
    VALUES (
      gig.id, 'standard', 'Standard',
      ROUND(gig.starting_price * 2, 2),
      CASE
        WHEN gig.delivery_days <= 2 THEN 3
        WHEN gig.delivery_days <= 5 THEN 7
        ELSE 10
      END,
      CASE gig.platform
        WHEN 'youtube' THEN '["Priority delivery", "Email + chat updates", "2 revisions", "Drip-feed delivery"]'::jsonb
        WHEN 'facebook' THEN '["Priority delivery", "Email + chat updates", "2 revisions", "Drip-feed delivery"]'::jsonb
        WHEN 'instagram' THEN '["Priority delivery", "Email + chat updates", "2 revisions", "Drip-feed delivery"]'::jsonb
        WHEN 'tiktok' THEN '["Priority delivery", "Email + chat updates", "2 revisions", "Drip-feed delivery"]'::jsonb
      END,
      1
    )
    ON CONFLICT DO NOTHING;

    -- Premium tier: ~4x starting price
    INSERT INTO gig_packages (gig_id, tier, name, price, delivery_days, features, sort_order)
    VALUES (
      gig.id, 'premium', 'Premium',
      ROUND(gig.starting_price * 4, 2),
      CASE
        WHEN gig.delivery_days <= 2 THEN 5
        WHEN gig.delivery_days <= 5 THEN 10
        ELSE 14
      END,
      CASE gig.platform
        WHEN 'youtube' THEN '["Express delivery", "Priority support", "Unlimited revisions", "Drip-feed + gradual ramp", "Detailed progress report"]'::jsonb
        WHEN 'facebook' THEN '["Express delivery", "Priority support", "Unlimited revisions", "Drip-feed + gradual ramp", "Detailed progress report"]'::jsonb
        WHEN 'instagram' THEN '["Express delivery", "Priority support", "Unlimited revisions", "Drip-feed + gradual ramp", "Detailed progress report"]'::jsonb
        WHEN 'tiktok' THEN '["Express delivery", "Priority support", "Unlimited revisions", "Drip-feed + gradual ramp", "Detailed progress report"]'::jsonb
      END,
      2
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
