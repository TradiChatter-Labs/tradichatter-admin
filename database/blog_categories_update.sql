-- Update blog_posts category constraint to allow new marketing categories
-- Run this in Supabase SQL Editor

ALTER TABLE blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_category_check;

ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_category_check
  CHECK (category IN (
    'Business Tips',
    'How-To',
    'Nigerian Market',
    'Product Updates',
    'Success Stories',
    'Fraud & Safety',
    'Payments & Escrow',
    'Delivery & Logistics',
    'Sales & Marketing',
    'App Features',
    'Entrepreneur Life'
  ));
