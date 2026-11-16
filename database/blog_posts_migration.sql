-- ============================================================
-- Blog Posts Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Business Tips','How-To','Nigerian Market','Product Updates')),
  content JSONB NOT NULL DEFAULT '[]',
  cover_image_url TEXT,
  cover_emoji TEXT DEFAULT '📝',
  author TEXT DEFAULT 'TradiChatter Team',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published" ON blog_posts;
DROP POLICY IF EXISTS "Service role full access" ON blog_posts;

CREATE POLICY "Public read published" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Service role full access" ON blog_posts
  USING (auth.role() = 'service_role');

-- ============================================================
-- Seed: migrate existing 5 articles from posts.js
-- ============================================================

INSERT INTO blog_posts (slug, title, excerpt, category, content, cover_emoji, author, status, published_at, created_at, updated_at)
VALUES
(
  'how-to-sell-online-nigeria-safely',
  'How to Sell Online in Nigeria Safely (Without Getting Scammed)',
  'Millions of Nigerians sell on WhatsApp every day — but most have zero protection when buyers disappear or payments bounce. Here is the complete guide to selling online safely in Nigeria.',
  'How-To',
  '[
    {"type":"p","text":"Every day, thousands of Nigerian entrepreneurs lose money to online fraud. A buyer promises to pay after delivery. A seller collects payment and vanishes. A \"customer\" sends a fake bank alert. These are not rare stories — they are the daily reality of online commerce in Nigeria."},
    {"type":"p","text":"But it does not have to be this way. With the right tools and the right habits, you can sell online in Nigeria and get paid every single time. This guide covers everything you need to know."},
    {"type":"h2","text":"1. Never Release Goods Before Payment Clears"},
    {"type":"p","text":"This is the number one rule. Fake bank alerts are extremely common in Nigeria. A buyer sends you a screenshot of a transfer — but nothing has actually arrived in your account. Always log into your banking app directly and confirm the credit before releasing any product."},
    {"type":"tip","text":"Pro Tip: Set up instant SMS alerts on your bank account so you get a real notification the moment money arrives — not a screenshot from a buyer."},
    {"type":"h2","text":"2. Use Fund Protection Payments"},
    {"type":"p","text":"Fund protection (also called escrow) is the safest way to handle online transactions. The buyer pays into a secure protected account. The money is held there until the buyer confirms they have received the goods in good condition. Only then is the money released to the seller."},
    {"type":"h2","text":"3. Verify Your Buyers"},
    {"type":"p","text":"Before doing business with a new customer, do a basic check. Ask for their full name and phone number. Search their number on Google or social media. Check if they have reviews or a business presence."},
    {"type":"ul","text":"Ask for a phone number and verify it is active|Check their social media profile|Look for previous reviews or testimonials|For large orders, request a deposit first"},
    {"type":"h2","text":"4. Document Everything in Chat"},
    {"type":"p","text":"Keep all your business conversations in one place. When you negotiate price, delivery terms, and product specifications in a documented chat thread, you have a clear record if any dispute arises."},
    {"type":"h2","text":"5. Use a Business Account, Not Personal"},
    {"type":"p","text":"Mixing personal and business finances is a recipe for confusion and fraud. Open a dedicated business account. This makes it easier to track payments, spot suspicious transactions, and maintain professional credibility with customers."},
    {"type":"tip","text":"Bottom Line: The safest way to sell online in Nigeria is to use a platform that has fund protection, verified users, and documented transactions built in. That is exactly what TradiChatter was built to provide."}
  ]'::jsonb,
  '🛡️',
  'TradiChatter Team',
  'published',
  '2025-07-01T00:00:00Z',
  '2025-07-01T00:00:00Z',
  '2025-07-01T00:00:00Z'
),
(
  'what-is-escrow-and-why-nigerian-buyers-need-it',
  'What Is Escrow and Why Every Nigerian Buyer Needs It',
  'You have seen the stories — paid for a product online and the seller disappeared. Escrow (fund protection) solves this permanently. Here is how it works and why it matters for Nigerian commerce.',
  'Business Tips',
  '[
    {"type":"p","text":"You have probably heard the horror stories. Someone pays ₦150,000 for a laptop on Instagram. The seller stops responding. The money is gone. The police cannot help. The bank says the transfer was authorised. There is nothing to do."},
    {"type":"p","text":"This happens thousands of times every week in Nigeria. And it is completely preventable — with escrow."},
    {"type":"h2","text":"What Is Escrow?"},
    {"type":"p","text":"Escrow is a financial arrangement where a trusted third party holds money on behalf of two parties in a transaction. The buyer pays the money to the escrow service. The seller ships the goods. When the buyer confirms they have received the goods in good condition, the escrow service releases the money to the seller."},
    {"type":"h2","text":"How It Works on TradiChatter"},
    {"type":"ul","text":"Buyer and seller agree on price and terms in chat|Buyer pays into TradiChatter secure protected fund|Seller receives confirmation that funds are secured and ships the order|Buyer confirms receipt of goods|TradiChatter releases payment to seller instantly"},
    {"type":"h2","text":"Why Nigerian Buyers Specifically Need This"},
    {"type":"p","text":"Nigeria e-commerce market is growing at over 20% per year. But trust remains the biggest barrier. A 2024 survey found that 67% of Nigerians have either been scammed online or know someone who has."},
    {"type":"h2","text":"What About Sellers — Is Escrow Fair to Them?"},
    {"type":"p","text":"Absolutely. Escrow protects sellers just as much as buyers. Without escrow, sellers face fake bank alerts, buyers who claim non-delivery after receiving goods, and chargebacks. With escrow, the money is confirmed and locked before the seller ships."},
    {"type":"tip","text":"Key Insight: Escrow does not slow down commerce — it accelerates it. When buyers trust the platform, they buy more. When sellers trust the platform, they invest more in their business. Everyone wins."}
  ]'::jsonb,
  '🔒',
  'TradiChatter Team',
  'published',
  '2025-07-05T00:00:00Z',
  '2025-07-05T00:00:00Z',
  '2025-07-05T00:00:00Z'
),
(
  'whatsapp-vs-tradichatter-for-business',
  'WhatsApp vs TradiChatter for Business: An Honest Comparison',
  'WhatsApp is where Nigerian business started online. But is it still the best tool for serious sellers in 2025? We compare both platforms honestly so you can make the right choice.',
  'Nigerian Market',
  '[
    {"type":"p","text":"Let us be honest: WhatsApp built Nigerian e-commerce. Before any marketplace existed, before any payment app launched, Nigerian entrepreneurs were already running million-naira businesses on WhatsApp. It is familiar, it is free, and everyone has it."},
    {"type":"h2","text":"Payment Protection"},
    {"type":"p","text":"WhatsApp has zero payment protection. When you collect payment via bank transfer on WhatsApp, you are completely exposed to fake alerts. TradiChatter has fund protection built into every transaction."},
    {"type":"h2","text":"Business Analytics"},
    {"type":"p","text":"WhatsApp gives you read receipts. That is it. TradiChatter gives you a full analytics dashboard: sales trends, customer behaviour, product performance, revenue tracking, and team performance metrics."},
    {"type":"h2","text":"Customer Management"},
    {"type":"p","text":"On WhatsApp, your customer list is your phone contacts. There is no CRM, no customer history, no way to segment customers. TradiChatter has a built-in CRM with full purchase history and targeted broadcasts."},
    {"type":"h2","text":"Team Management"},
    {"type":"p","text":"WhatsApp Business allows one device per account. TradiChatter supports multiple team members with role-based permissions."},
    {"type":"h2","text":"Discoverability"},
    {"type":"p","text":"On WhatsApp, new customers can only find you if someone shares your number. TradiChatter has a marketplace where customers actively search for businesses by category, location, and rating."},
    {"type":"h2","text":"The Honest Verdict"},
    {"type":"p","text":"WhatsApp is a great messaging app. It is not a business platform. If you are serious about building a real business — with protected payments, real analytics, a professional storefront, and a team — you need a proper platform."},
    {"type":"tip","text":"The good news: You do not have to choose. TradiChatter lets you keep using WhatsApp for personal chats while running your business professionally on a platform built for commerce."}
  ]'::jsonb,
  '⚖️',
  'TradiChatter Team',
  'published',
  '2025-07-10T00:00:00Z',
  '2025-07-10T00:00:00Z',
  '2025-07-10T00:00:00Z'
),
(
  'how-to-grow-your-small-business-with-chat-commerce',
  'How to Grow Your Small Business with Chat Commerce in 2025',
  'Chat commerce is the fastest-growing sales channel in Africa. Nigerian businesses using chat-first selling are growing 3x faster than those using traditional methods. Here is how to do it right.',
  'Business Tips',
  '[
    {"type":"p","text":"Chat commerce — selling products and services through conversational messaging — is not a trend. It is the dominant sales model for small businesses across Africa, Southeast Asia, and Latin America."},
    {"type":"h2","text":"1. Build a Professional Product Catalogue"},
    {"type":"p","text":"Your product catalogue is your digital shop window. Every product needs a clear photo, a specific description, a price, and stock availability. Vague listings like DM for price kill conversions."},
    {"type":"tip","text":"Action Step: Spend one afternoon photographing all your products against a clean white background. Good photos alone can increase enquiries by 40%."},
    {"type":"h2","text":"2. Respond Fast — Speed Wins"},
    {"type":"p","text":"In chat commerce, speed is everything. Studies show that responding to a customer enquiry within 5 minutes makes you 9x more likely to close the sale than responding after 30 minutes."},
    {"type":"h2","text":"3. Use Broadcasts Strategically"},
    {"type":"p","text":"Broadcasting to all your customers at once is one of the most powerful tools in chat commerce. But most sellers do it wrong — they send the same generic message to everyone, which feels like spam."},
    {"type":"h2","text":"4. Create Urgency Without Being Pushy"},
    {"type":"ul","text":"Show real stock levels in your catalogue|Set genuine flash sale windows|Offer early access to new products for loyal customers|Use waitlists for popular items to create natural demand"},
    {"type":"h2","text":"5. Turn Every Sale into a Repeat Customer"},
    {"type":"p","text":"Acquiring a new customer costs 5x more than retaining an existing one. After every successful order, send a follow-up message 3 days later asking if they are happy with the product."},
    {"type":"h2","text":"6. Track What Is Actually Working"},
    {"type":"p","text":"Most small business owners have no idea which products drive the most revenue. TradiChatter analytics dashboard shows you all of this in real time."},
    {"type":"tip","text":"The Compound Effect: Each of these steps alone will improve your results. All six together create a compounding growth engine."}
  ]'::jsonb,
  '📈',
  'TradiChatter Team',
  'published',
  '2025-07-15T00:00:00Z',
  '2025-07-15T00:00:00Z',
  '2025-07-15T00:00:00Z'
),
(
  'tradichatter-launch-nigeria-chat-commerce',
  'TradiChatter Is Here: Nigeria''s First Complete Chat-Commerce Platform',
  'After two years of building, testing, and listening to Nigerian entrepreneurs, TradiChatter is officially live. Here is everything that is in the platform and what it means for African commerce.',
  'Product Updates',
  '[
    {"type":"p","text":"Today is a big day. After two years of building, testing with real Nigerian businesses, and iterating based on feedback from thousands of entrepreneurs, TradiChatter is officially live and open to everyone."},
    {"type":"h2","text":"What Is in the Platform Today"},
    {"type":"ul","text":"Chat Commerce — sell products directly in conversation with built-in order creation|Fund Protection Payments — buyer money held securely until delivery confirmed|Marketplace — searchable storefront visible to new customers every day|Business Analytics — real-time dashboard for sales, customers, and products|Team Management — add staff with role-based permissions|Delivery Integration — book and track shipments with Nigeria top logistics providers|KYC Verification — verified business badges that build customer trust|AI Secretary — automated responses to common customer questions"},
    {"type":"h2","text":"Who It Is Built For"},
    {"type":"p","text":"TradiChatter is built for Nigerian small and medium businesses — fashion sellers, electronics dealers, food vendors, beauty brands, and anyone who sells products or services and wants to do it professionally and safely."},
    {"type":"h2","text":"Pricing That Makes Sense"},
    {"type":"p","text":"We have three plans: a free plan for businesses just starting out, a growth plan for businesses ready to scale, and a professional plan for established operations."},
    {"type":"h2","text":"What Comes Next"},
    {"type":"p","text":"This is version one. We have a long roadmap ahead — group buying, advanced affiliate marketing, voice commerce, and expansion into Ghana, Kenya, and South Africa."},
    {"type":"tip","text":"Get Started: Download TradiChatter today. Your first month on the Growth plan is free. No credit card required. Just sign up and start selling safely."}
  ]'::jsonb,
  '🚀',
  'TradiChatter Team',
  'published',
  '2025-07-20T00:00:00Z',
  '2025-07-20T00:00:00Z',
  '2025-07-20T00:00:00Z'
)
ON CONFLICT (slug) DO NOTHING;
