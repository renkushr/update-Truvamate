# 🔍 Truvamate Marketplace - System Review & Backend Architecture Plan

## 📊 EXECUTIVE SUMMARY

**Project**: Truvamate Marketplace - USA Import & Special Products Platform  
**Current Status**: Frontend Complete (React + TypeScript + Vite)  
**Backend Status**: Mock Data (LocalStorage) - **NEEDS PRODUCTION BACKEND**  
**Critical Focus**: Lotto/Special Products System  
**Legal Model**: Messenger Service (NOT E-commerce)

---

## 🎯 CURRENT SYSTEM OVERVIEW

### ✅ Completed Features

#### 1. **Frontend Architecture**
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6.4.1
- **Routing**: React Router v7 (BrowserRouter)
- **Styling**: Tailwind CSS (CDN)
- **Deployment**: Vercel
- **State Management**: Context API (GlobalContext)

#### 2. **Core Pages**
- ✅ Home - Hero section, products, categories
- ✅ Marketplace - Product listings
- ✅ Special Products (Lotto) - **CRITICAL SYSTEM**
- ✅ Cart & Checkout
- ✅ User Profile
- ✅ Admin Panel - CMS management
- ✅ Seller Dashboard
- ✅ Legal Pages (Terms, Privacy, PDPA)
- ✅ Location Analytics

#### 3. **Key Systems**
- ✅ Authentication UI (mock)
- ✅ Shopping Cart (localStorage)
- ✅ Order Management (localStorage)
- ✅ CMS System (Firebase Firestore)
- ✅ Location Tracking (IP geolocation)
- ✅ SEO Optimization
- ✅ Mobile Responsive

---

## 🎰 LOTTO/SPECIAL PRODUCTS SYSTEM - DETAILED REVIEW

### Current Implementation

#### Data Structure
```typescript
interface LottoTicket {
  id: number | string;
  numbers: number[];           // 5 main numbers
  special: number;             // Powerball or Mega Millions number
  type: 'Powerball' | 'Mega Millions';
  drawDate?: string;
  status?: 'pending' | 'won' | 'lost';
  price?: number;              // Currently 175 THB
  multiplier?: boolean;
  purchaseDate?: string;
}
```

#### Game Rules
```typescript
const GAME_RULES = {
  'Powerball': { 
    maxMain: 69,        // Pick 5 from 1-69
    maxSpecial: 26,     // Pick 1 from 1-26 (Powerball)
    name: 'Powerball', 
    color: 'bg-red-600', 
    specialName: 'PB' 
  },
  'Mega Millions': { 
    maxMain: 70,        // Pick 5 from 1-70
    maxSpecial: 25,     // Pick 1 from 1-25 (Mega Ball)
    name: 'Mega Millions', 
    color: 'bg-brand-gold', 
    specialName: 'MM' 
  }
};
```

#### Pricing
- **Base Price**: $2 USD (Powerball/Mega Millions ticket)
- **Service Fee**: $5 USD (Messenger/Handling)
- **Total**: $7 USD = **175 THB** (at 35 THB/USD)

#### User Flow
1. **Legal Consent Modal** (First visit)
   - Age verification (20+)
   - Terms acceptance
   - Messenger service disclaimer
   - Stored in `localStorage: truvamate_special_consent`

2. **Ticket Selection**
   - Choose game type (Powerball/Mega Millions)
   - Manual number selection (1-69/70 main + 1-26/25 special)
   - Quick Pick (random generation)
   - Add multiple tickets to cart

3. **Login Check**
   - Redirect to login if not authenticated
   - Continue to checkout if logged in

4. **Checkout**
   - Review tickets
   - Payment method selection
   - Email confirmation notice (24 hours)

5. **Order Confirmation**
   - Order saved to profile
   - Status: "Waiting for Draw"
   - Email notification scheduled

### 🚨 Critical Issues (Current Mock System)

#### ❌ No Real Backend
- Tickets stored in localStorage only
- No server-side validation
- No actual ticket purchase in USA
- No draw result checking
- No payout system

#### ❌ No Payment Processing
- Mock payment UI
- No real payment gateway integration
- No transaction records

#### ❌ No Email System
- Shows "email in 24 hours" message
- But no actual email sent

#### ❌ No Draw Management
- Manual jackpot data
- No API integration with official lottery sites
- No automated draw result checking

#### ❌ Legal Compliance Gaps
- Terms displayed but not legally binding
- No age verification system
- No identity verification (KYC)
- No transaction limits

---

## 🏗️ PRODUCTION BACKEND ARCHITECTURE

### Technology Stack Recommendation

#### Backend Framework
```
Option 1: Node.js + Express + TypeScript (Recommended)
- Fast development
- Same language as frontend
- Large ecosystem
- Good for MVP

Option 2: Node.js + NestJS + TypeScript (Scalable)
- Enterprise-grade
- Built-in architecture
- Better for large team
- More overhead

Option 3: Python + FastAPI (Alternative)
- Great for ML/AI features
- Good async support
- Excellent documentation
```

#### Database
```
Primary Database: PostgreSQL
- Relational data (users, orders, tickets)
- ACID compliance
- Complex queries
- JSON support for flexible data

Secondary: Redis
- Session management
- Caching
- Rate limiting
- Real-time features

Optional: MongoDB
- Logs
- Analytics
- Non-critical data
```

#### Infrastructure
```
Hosting: 
- Railway.app (Easy, affordable)
- Render.com (Free tier available)
- DigitalOcean App Platform
- AWS/GCP (Production scale)

File Storage:
- AWS S3 / CloudFlare R2
- Current: Firebase Storage ✅

CDN:
- CloudFlare (Free tier)
- Images, static assets
```

---

## 📐 DETAILED BACKEND ARCHITECTURE

### 1. DATABASE SCHEMA

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE NOT NULL,
  national_id VARCHAR(20), -- For Thai users (KYC)
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(10),
  country VARCHAR(2) DEFAULT 'TH',
  
  -- Verification
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
  kyc_verified_at TIMESTAMP,
  
  -- Account
  role VARCHAR(20) DEFAULT 'customer', -- customer, seller, admin
  status VARCHAR(20) DEFAULT 'active', -- active, suspended, banned
  avatar_url TEXT,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  last_login_ip VARCHAR(45),
  last_login_location JSONB,
  
  -- Preferences
  preferences JSONB DEFAULT '{}',
  
  CONSTRAINT check_age CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '20 years')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

#### Lotto Orders Table
```sql
CREATE TABLE lotto_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Order Info
  order_number VARCHAR(50) UNIQUE NOT NULL, -- LTO-2025-XXXXX
  status VARCHAR(20) NOT NULL DEFAULT 'pending', 
    -- pending, payment_pending, payment_failed, confirmed, 
    -- purchased_usa, waiting_draw, checking_results, 
    -- no_win, partial_win, jackpot, payout_processing, completed, cancelled
  
  -- Pricing
  total_tickets INTEGER NOT NULL,
  ticket_price_usd DECIMAL(10,2) NOT NULL DEFAULT 2.00,
  service_fee_usd DECIMAL(10,2) NOT NULL DEFAULT 5.00,
  total_per_ticket_usd DECIMAL(10,2) NOT NULL DEFAULT 7.00,
  total_amount_usd DECIMAL(10,2) NOT NULL,
  exchange_rate DECIMAL(10,4) NOT NULL, -- THB per USD at purchase time
  total_amount_thb DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_method VARCHAR(50), -- credit_card, promptpay, bank_transfer
  payment_reference VARCHAR(100),
  payment_status VARCHAR(20), -- pending, completed, failed, refunded
  paid_at TIMESTAMP,
  
  -- Purchase in USA
  usa_purchase_status VARCHAR(20), -- not_purchased, in_progress, completed, failed
  usa_purchase_date TIMESTAMP,
  usa_purchase_reference VARCHAR(100), -- Ticket barcode/reference from USA
  usa_purchase_receipt_url TEXT,
  
  -- Results
  draw_date DATE,
  draw_checked_at TIMESTAMP,
  winning_amount_usd DECIMAL(15,2) DEFAULT 0,
  winning_amount_thb DECIMAL(15,2) DEFAULT 0,
  
  -- Payout
  payout_status VARCHAR(20), -- not_applicable, pending, processing, completed, failed
  payout_method VARCHAR(50),
  payout_reference VARCHAR(100),
  payout_completed_at TIMESTAMP,
  
  -- Email Notifications
  email_confirmation_sent BOOLEAN DEFAULT FALSE,
  email_purchase_sent BOOLEAN DEFAULT FALSE,
  email_draw_result_sent BOOLEAN DEFAULT FALSE,
  email_payout_sent BOOLEAN DEFAULT FALSE,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  
  -- Location
  order_location JSONB, -- IP, city, country from location tracking
  
  -- Notes
  admin_notes TEXT,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_lotto_orders_user ON lotto_orders(user_id);
CREATE INDEX idx_lotto_orders_status ON lotto_orders(status);
CREATE INDEX idx_lotto_orders_order_number ON lotto_orders(order_number);
CREATE INDEX idx_lotto_orders_draw_date ON lotto_orders(draw_date);
CREATE INDEX idx_lotto_orders_created_at ON lotto_orders(created_at DESC);
```

#### Lotto Tickets Table
```sql
CREATE TABLE lotto_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES lotto_orders(id),
  
  -- Ticket Info
  ticket_number VARCHAR(50) UNIQUE NOT NULL, -- Unique ticket identifier
  game_type VARCHAR(20) NOT NULL, -- Powerball, MegaMillions
  
  -- Numbers
  numbers INTEGER[] NOT NULL, -- Array of 5 main numbers [5,12,23,34,45]
  special_number INTEGER NOT NULL, -- Powerball or Mega Millions number
  
  CONSTRAINT check_numbers_length CHECK (array_length(numbers, 1) = 5),
  CONSTRAINT check_powerball_main CHECK (
    game_type != 'Powerball' OR 
    (numbers <@ ARRAY(SELECT generate_series(1, 69)))
  ),
  CONSTRAINT check_powerball_special CHECK (
    game_type != 'Powerball' OR 
    (special_number BETWEEN 1 AND 26)
  ),
  CONSTRAINT check_mega_millions_main CHECK (
    game_type != 'MegaMillions' OR 
    (numbers <@ ARRAY(SELECT generate_series(1, 70)))
  ),
  CONSTRAINT check_mega_millions_special CHECK (
    game_type != 'MegaMillions' OR 
    (special_number BETWEEN 1 AND 25)
  ),
  
  -- Power Play / Megaplier (Optional add-on)
  has_multiplier BOOLEAN DEFAULT FALSE,
  multiplier_value INTEGER, -- 2x, 3x, 4x, 5x, 10x
  
  -- Results
  matched_main_numbers INTEGER DEFAULT 0, -- 0-5
  matched_special BOOLEAN DEFAULT FALSE,
  prize_tier VARCHAR(20), -- jackpot, match_5, match_4_special, etc.
  prize_amount_usd DECIMAL(15,2) DEFAULT 0,
  
  -- USA Purchase Details
  usa_ticket_barcode VARCHAR(100), -- Actual barcode from USA ticket
  usa_ticket_image_url TEXT, -- Photo of physical ticket
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES lotto_orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_lotto_tickets_order ON lotto_tickets(order_id);
CREATE INDEX idx_lotto_tickets_game_type ON lotto_tickets(game_type);
CREATE INDEX idx_lotto_tickets_numbers ON lotto_tickets USING GIN(numbers);
```

#### Draw Results Table
```sql
CREATE TABLE draw_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Draw Info
  game_type VARCHAR(20) NOT NULL, -- Powerball, MegaMillions
  draw_date DATE NOT NULL,
  draw_time TIME NOT NULL,
  draw_number INTEGER NOT NULL, -- Sequential draw number
  
  -- Winning Numbers
  winning_numbers INTEGER[] NOT NULL,
  special_number INTEGER NOT NULL,
  multiplier_value INTEGER, -- For Power Play/Megaplier
  
  -- Jackpot
  jackpot_amount_usd DECIMAL(15,2) NOT NULL,
  jackpot_winners INTEGER DEFAULT 0,
  
  -- Total Winners by Tier
  winners_by_tier JSONB, -- {"match_5": 2, "match_4_special": 15, ...}
  
  -- Source
  official_url TEXT, -- Link to official result
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(game_type, draw_date),
  
  CONSTRAINT check_winning_numbers_length CHECK (array_length(winning_numbers, 1) = 5)
);

CREATE INDEX idx_draw_results_game_date ON draw_results(game_type, draw_date DESC);
```

#### Marketplace Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id),
  
  -- Product Info
  sku VARCHAR(100) UNIQUE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  brand VARCHAR(100),
  
  -- Pricing
  price_usd DECIMAL(10,2) NOT NULL,
  original_price_usd DECIMAL(10,2),
  price_thb DECIMAL(10,2) NOT NULL,
  original_price_thb DECIMAL(10,2),
  
  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  
  -- Images
  main_image_url TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]',
  
  -- Attributes
  attributes JSONB DEFAULT '{}', -- {size: "M", color: "Red"}
  variants JSONB DEFAULT '[]', -- Different SKUs for variants
  
  -- Shipping
  weight_kg DECIMAL(10,2),
  dimensions JSONB, -- {length, width, height}
  ships_from VARCHAR(100),
  
  -- SEO
  slug VARCHAR(500) UNIQUE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT[],
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- draft, active, out_of_stock, discontinued
  is_featured BOOLEAN DEFAULT FALSE,
  is_flash_sale BOOLEAN DEFAULT FALSE,
  flash_sale_ends_at TIMESTAMP,
  
  -- Stats
  views INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_products_status ON products(status) WHERE status = 'active';
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_flash_sale ON products(is_flash_sale) WHERE is_flash_sale = TRUE;
```

#### Marketplace Orders Table
```sql
CREATE TABLE marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Order Info
  order_number VARCHAR(50) UNIQUE NOT NULL, -- MPL-2025-XXXXX
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending, payment_pending, payment_confirmed, 
    -- processing, shipped, delivered, cancelled, refunded
  
  -- Pricing
  subtotal_usd DECIMAL(10,2) NOT NULL,
  subtotal_thb DECIMAL(10,2) NOT NULL,
  shipping_fee_usd DECIMAL(10,2) DEFAULT 0,
  shipping_fee_thb DECIMAL(10,2) DEFAULT 0,
  tax_usd DECIMAL(10,2) DEFAULT 0,
  tax_thb DECIMAL(10,2) DEFAULT 0,
  discount_usd DECIMAL(10,2) DEFAULT 0,
  discount_thb DECIMAL(10,2) DEFAULT 0,
  total_usd DECIMAL(10,2) NOT NULL,
  total_thb DECIMAL(10,2) NOT NULL,
  exchange_rate DECIMAL(10,4) NOT NULL,
  
  -- Payment
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  payment_status VARCHAR(20),
  paid_at TIMESTAMP,
  
  -- Shipping
  shipping_address JSONB NOT NULL,
  shipping_method VARCHAR(50),
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_marketplace_orders_user ON marketplace_orders(user_id);
CREATE INDEX idx_marketplace_orders_status ON marketplace_orders(status);
CREATE INDEX idx_marketplace_orders_created_at ON marketplace_orders(created_at DESC);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES marketplace_orders(id),
  product_id UUID REFERENCES products(id),
  
  -- Product Snapshot (at time of purchase)
  product_title VARCHAR(500) NOT NULL,
  product_sku VARCHAR(100),
  product_image_url TEXT,
  selected_variant JSONB, -- {size: "M", color: "Red"}
  
  -- Pricing
  unit_price_usd DECIMAL(10,2) NOT NULL,
  unit_price_thb DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal_usd DECIMAL(10,2) NOT NULL,
  subtotal_thb DECIMAL(10,2) NOT NULL,
  
  -- Fulfillment
  seller_id UUID REFERENCES users(id),
  fulfillment_status VARCHAR(20) DEFAULT 'pending',
    -- pending, processing, shipped, delivered, cancelled
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  CONSTRAINT check_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_seller ON order_items(seller_id);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  order_type VARCHAR(20) NOT NULL, -- lotto, marketplace
  order_id UUID NOT NULL, -- References lotto_orders or marketplace_orders
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Payment Info
  payment_method VARCHAR(50) NOT NULL, 
    -- credit_card, promptpay, bank_transfer, paypal
  payment_provider VARCHAR(50), -- stripe, omise, promptpay, etc.
  payment_reference VARCHAR(100) UNIQUE,
  
  -- Amount
  amount_usd DECIMAL(10,2) NOT NULL,
  amount_thb DECIMAL(10,2) NOT NULL,
  exchange_rate DECIMAL(10,4) NOT NULL,
  fee_usd DECIMAL(10,2) DEFAULT 0,
  fee_thb DECIMAL(10,2) DEFAULT 0,
  net_amount_usd DECIMAL(10,2) NOT NULL,
  net_amount_thb DECIMAL(10,2) NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending, processing, completed, failed, refunded, disputed
  
  -- Provider Response
  provider_transaction_id VARCHAR(200),
  provider_response JSONB,
  
  -- Card Info (if applicable)
  card_last4 VARCHAR(4),
  card_brand VARCHAR(20),
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  failure_reason TEXT,
  refunded_at TIMESTAMP,
  refund_amount_thb DECIMAL(10,2),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_order ON payments(order_id, order_type);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
```

#### Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User
  user_id UUID REFERENCES users(id),
  user_role VARCHAR(20),
  
  -- Activity
  action VARCHAR(100) NOT NULL, -- login, logout, create_order, etc.
  resource_type VARCHAR(50), -- user, order, product, ticket
  resource_id UUID,
  
  -- Details
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Request Info
  ip_address VARCHAR(45),
  user_agent TEXT,
  location JSONB,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

#### Email Queue Table
```sql
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  to_email VARCHAR(255) NOT NULL,
  to_name VARCHAR(255),
  
  -- Content
  template_name VARCHAR(100) NOT NULL, 
    -- order_confirmation, purchase_notification, draw_results, etc.
  subject VARCHAR(500) NOT NULL,
  html_body TEXT NOT NULL,
  text_body TEXT,
  template_data JSONB DEFAULT '{}',
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, sending, sent, failed
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scheduled_for TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  failed_at TIMESTAMP,
  error_message TEXT,
  
  -- Priority
  priority INTEGER DEFAULT 5 -- 1 (highest) to 10 (lowest)
);

CREATE INDEX idx_email_queue_status ON email_queue(status) WHERE status IN ('pending', 'failed');
CREATE INDEX idx_email_queue_scheduled ON email_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_email_queue_priority ON email_queue(priority DESC, created_at ASC);
```

---

### 2. API ENDPOINTS

#### Authentication API
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/resend-verification
GET    /api/auth/me
PUT    /api/auth/update-profile
PUT    /api/auth/change-password
```

#### Lotto API
```
GET    /api/lotto/jackpots              # Get current jackpots
GET    /api/lotto/games                 # Get game rules
GET    /api/lotto/draws/history         # Past draw results
GET    /api/lotto/draws/:gameType/:date # Specific draw result

POST   /api/lotto/orders                # Create order
GET    /api/lotto/orders                # Get user's orders
GET    /api/lotto/orders/:id            # Get specific order
PUT    /api/lotto/orders/:id/cancel     # Cancel order (if unpaid)

GET    /api/lotto/tickets               # Get user's tickets
GET    /api/lotto/tickets/:id           # Get ticket details

POST   /api/lotto/quick-pick            # Generate random numbers

# Admin Only
POST   /api/admin/lotto/draws           # Add draw result
PUT    /api/admin/lotto/draws/:id       # Update draw result
POST   /api/admin/lotto/check-results   # Check all pending tickets
PUT    /api/admin/lotto/orders/:id/status # Update order status
POST   /api/admin/lotto/purchase-usa    # Mark as purchased in USA
```

#### Products API
```
GET    /api/products                    # List products (with filters)
GET    /api/products/:id                # Get product details
GET    /api/products/slug/:slug         # Get by slug
POST   /api/products                    # Create product (seller/admin)
PUT    /api/products/:id                # Update product
DELETE /api/products/:id                # Delete product
POST   /api/products/:id/review         # Add review
```

#### Marketplace Orders API
```
POST   /api/orders                      # Create order
GET    /api/orders                      # Get user's orders
GET    /api/orders/:id                  # Get order details
PUT    /api/orders/:id/cancel           # Cancel order

# Seller
GET    /api/seller/orders               # Get seller orders
PUT    /api/seller/orders/:id/fulfill   # Mark as fulfilled
```

#### Payment API
```
POST   /api/payments/create-intent      # Create payment intent (Stripe/Omise)
POST   /api/payments/confirm            # Confirm payment
POST   /api/payments/promptpay          # Generate PromptPay QR
POST   /api/payments/webhook            # Payment webhook
GET    /api/payments/:id/status         # Check payment status
```

#### Location API
```
GET    /api/location                    # Get user's location (IP-based)
GET    /api/admin/location/analytics    # Get location analytics
```

#### Admin API
```
GET    /api/admin/dashboard             # Dashboard stats
GET    /api/admin/users                 # List users
GET    /api/admin/users/:id             # User details
PUT    /api/admin/users/:id/status      # Ban/activate user
GET    /api/admin/orders                # All orders
GET    /api/admin/revenue               # Revenue reports
GET    /api/admin/logs                  # Activity logs
```

---

### 3. THIRD-PARTY INTEGRATIONS

#### Payment Gateways
```
1. Stripe (International Cards)
   - Credit/Debit cards
   - 3.4% + 11 THB per transaction
   - Strong fraud detection
   
2. Omise (Thailand)
   - Thai credit cards
   - PromptPay
   - 3.65% per transaction
   - Better for Thai market
   
3. PayPal (Optional)
   - International users
   - Higher fees (4.4% + fixed)
```

#### Email Service
```
1. SendGrid (Recommended)
   - 100 emails/day free
   - Good deliverability
   - Template system
   
2. AWS SES (Cost-effective)
   - $0.10 per 1,000 emails
   - Requires warm-up
   
3. Mailgun (Alternative)
   - First 5,000 emails free
   - Good for transactional
```

#### SMS Service (OTP)
```
1. Twilio
   - Global coverage
   - Reliable
   
2. AWS SNS
   - Cost-effective
   - Good for Asia
```

#### Storage
```
Current: Firebase Storage ✅
Alternative: AWS S3 / CloudFlare R2
```

#### Lottery Data API
```
Problem: No official API for Powerball/Mega Millions
Solutions:
1. Web scraping (official websites)
   - powerball.com
   - megamillions.com
   
2. Third-party data providers
   - lottery.net API
   - Custom scraper with cron job
   
3. Manual entry (Admin panel)
   - For MVP, manual is acceptable
   - Automate later
```

---

### 4. BUSINESS LOGIC FLOWS

#### A. Lotto Order Flow

```
1. USER CREATES ORDER
   ├─ Selects game type
   ├─ Picks numbers (manual or quick pick)
   ├─ Adds multiple tickets
   ├─ Reviews total (tickets × 175 THB)
   └─ Clicks checkout

2. AUTHENTICATION CHECK
   ├─ If not logged in → Redirect to login
   └─ If logged in → Continue

3. PAYMENT
   ├─ User selects payment method
   ├─ Creates payment intent
   ├─ Processes payment
   │   ├─ Credit Card → Stripe/Omise
   │   ├─ PromptPay → Omise QR code
   │   └─ Bank Transfer → Manual verification
   │
   ├─ If payment successful:
   │   ├─ Update order status to "confirmed"
   │   ├─ Send email confirmation
   │   └─ Create activity log
   │
   └─ If payment failed:
       ├─ Update order status to "payment_failed"
       └─ Notify user

4. USA PURCHASE (WITHIN 24 HOURS)
   ├─ Admin/Agent in USA receives order
   ├─ Buys physical tickets at authorized retailer
   ├─ Takes photo of tickets
   ├─ Updates order:
   │   ├─ Status → "purchased_usa"
   │   ├─ Uploads ticket images
   │   └─ Records barcodes
   │
   └─ Sends notification email with ticket proof

5. WAITING FOR DRAW
   ├─ Order status → "waiting_draw"
   ├─ System monitors draw date
   └─ Sends reminder before draw

6. DRAW RESULTS (AUTOMATED)
   ├─ Cron job fetches official results
   ├─ Stores in draw_results table
   ├─ Triggers result checking job
   └─ For each ticket:
       ├─ Compare numbers
       ├─ Calculate matches
       ├─ Determine prize tier
       └─ Calculate winning amount

7. WIN CHECKING
   ├─ If no win:
   │   ├─ Update status → "no_win"
   │   └─ Send consolation email
   │
   └─ If win:
       ├─ Update status → "partial_win" or "jackpot"
       ├─ Calculate winning amount
       ├─ Send congratulations email
       └─ Status → "payout_processing"

8. PAYOUT (IF WIN)
   ├─ Small prizes (< $600):
   │   ├─ Agent claims at retailer
   │   ├─ Transfers to user's account
   │   └─ Commission: 10%
   │
   └─ Large prizes (≥ $600):
       ├─ User must claim in person in USA
       ├─ Or authorize agent (with fee)
       ├─ Tax implications (30% for non-US)
       └─ Wire transfer to Thailand

9. COMPLETION
   ├─ Update status → "completed"
   ├─ Send final email
   └─ Close order
```

#### B. Marketplace Order Flow

```
1. USER ADDS TO CART
   ├─ Browses products
   ├─ Adds items to cart (localStorage)
   └─ Reviews cart

2. CHECKOUT
   ├─ Login check
   ├─ Enter shipping address
   ├─ Select shipping method
   └─ Calculate totals

3. PAYMENT
   ├─ Choose payment method
   ├─ Process payment
   └─ Confirm order

4. FULFILLMENT
   ├─ Notify seller (if marketplace model)
   ├─ Or process internally (if import model)
   ├─ Pack order
   ├─ Ship with tracking
   └─ Update status

5. DELIVERY
   ├─ Track shipment
   ├─ Confirm delivery
   └─ Request review

6. COMPLETION
   ├─ Order completed
   └─ Release payment to seller (if applicable)
```

---

### 5. SECURITY CONSIDERATIONS

#### Authentication
```
✅ JWT tokens (access + refresh)
✅ Password hashing (bcrypt, salt rounds: 12)
✅ Rate limiting (login attempts)
✅ 2FA optional (TOTP)
✅ Session management
✅ IP tracking
```

#### API Security
```
✅ HTTPS only
✅ CORS configuration
✅ Rate limiting (per IP, per user)
✅ Input validation (Joi/Zod)
✅ SQL injection prevention (parameterized queries)
✅ XSS prevention (sanitize inputs)
✅ CSRF tokens
```

#### Payment Security
```
✅ PCI DSS compliance (use Stripe/Omise)
✅ Never store full card numbers
✅ Tokenization
✅ 3D Secure
✅ Fraud detection
```

#### Data Protection (PDPA)
```
✅ Encrypt sensitive data
✅ Data access logs
✅ User consent tracking
✅ Data deletion on request
✅ Privacy policy
✅ Terms & conditions
```

---

### 6. BACKGROUND JOBS (CRON)

```typescript
// Every hour - Check jackpots
@Cron('0 * * * *')
async updateJackpots() {
  // Scrape Powerball website
  // Scrape Mega Millions website
  // Update database
  // Cache results
}

// Every day at 1 AM - Fetch draw results
@Cron('0 1 * * *')
async checkDrawResults() {
  // For each game type
  // Get yesterday's draw
  // Save to draw_results
  // Trigger result checking
}

// Every day at 2 AM - Check ticket results
@Cron('0 2 * * *')
async checkTicketResults() {
  // Get all tickets with status "waiting_draw"
  // Where draw_date = yesterday
  // Check against draw_results
  // Update ticket status
  // Calculate winnings
  // Send notifications
}

// Every 5 minutes - Process email queue
@Cron('*/5 * * * *')
async processEmailQueue() {
  // Get pending emails
  // Send via SendGrid
  // Update status
  // Retry failed (max 3 attempts)
}

// Every day at 3 AM - Generate reports
@Cron('0 3 * * *')
async generateDailyReports() {
  // Revenue report
  // Sales report
  // User activity
  // Send to admin
}

// Every hour - Check payment status
@Cron('0 * * * *')
async checkPendingPayments() {
  // Get payments with status "pending"
  // Older than 15 minutes
  // Check with payment provider
  // Update status
  // Send notifications
}
```

---

### 7. ADMIN DASHBOARD FEATURES

```
1. Overview
   - Total revenue (today, week, month, year)
   - Total orders (lotto + marketplace)
   - Total users (new, active)
   - Pending orders
   - Pending payments

2. Lotto Management
   - Orders list (filter by status, date)
   - Order details (tickets, payment, status)
   - Update order status
   - Upload USA ticket photos
   - Enter draw results (manual)
   - Check results (bulk)
   - Payout management

3. Marketplace Management
   - Product management (CRUD)
   - Orders list
   - Seller management
   - Inventory tracking

4. User Management
   - User list
   - User details
   - KYC verification
   - Ban/suspend users
   - Activity logs

5. Financial
   - Revenue reports
   - Payment transactions
   - Refunds
   - Payout history
   - Commission tracking

6. Analytics
   - Location analytics (map)
   - Sales trends (charts)
   - Popular games
   - Popular products
   - User behavior

7. System
   - Email logs
   - Activity logs
   - Error logs
   - Cron job status
   - Background jobs queue

8. CMS (Already implemented)
   - Hero section
   - Promo banners
   - Category banners
```

---

### 8. MOBILE APP CONSIDERATIONS

```
Future: React Native / Flutter app

Backend changes needed:
- Push notifications (FCM)
- Mobile-optimized APIs
- Deep linking
- In-app purchases (for iOS/Android)
- Biometric authentication
```

---

### 9. SCALABILITY PLAN

```
Stage 1: MVP (Current + Basic Backend)
- 100-500 users
- Single server (Railway/Render)
- PostgreSQL (managed)
- Redis (managed)
- Estimated cost: $20-50/month

Stage 2: Growth (1K-5K users)
- Load balancer
- Multiple app servers
- Database read replicas
- CDN for static assets
- Caching layer (Redis)
- Estimated cost: $100-300/month

Stage 3: Scale (10K+ users)
- Kubernetes cluster
- Microservices architecture
- Database sharding
- Message queue (RabbitMQ/Kafka)
- Separate worker servers
- Multi-region deployment
- Estimated cost: $500-2000/month
```

---

### 10. DEVELOPMENT ROADMAP

#### Phase 1: Backend Foundation (2-3 weeks)
- [ ] Setup Node.js + Express + TypeScript
- [ ] Database schema implementation
- [ ] Authentication system
- [ ] Basic CRUD APIs
- [ ] Payment integration (Stripe)
- [ ] Email service setup
- [ ] Admin dashboard (basic)

#### Phase 2: Lotto System (2-3 weeks)
- [ ] Lotto order APIs
- [ ] Ticket management
- [ ] Draw result scraper
- [ ] Result checking logic
- [ ] Email notifications
- [ ] Admin lotto panel
- [ ] Testing & debugging

#### Phase 3: Marketplace (2 weeks)
- [ ] Product management
- [ ] Shopping cart API
- [ ] Order processing
- [ ] Seller dashboard backend
- [ ] Inventory management

#### Phase 4: Advanced Features (2 weeks)
- [ ] Location analytics
- [ ] Activity logging
- [ ] Revenue reports
- [ ] Background jobs
- [ ] Monitoring & alerts
- [ ] Performance optimization

#### Phase 5: Testing & Launch (1 week)
- [ ] Integration testing
- [ ] Load testing
- [ ] Security audit
- [ ] Deploy to production
- [ ] Monitor & fix issues

**Total Estimated Time: 9-11 weeks**

---

### 11. ESTIMATED COSTS (MONTHLY)

```
Infrastructure:
- Server (Railway/Render)      $20-50
- Database (Managed Postgres)  $15-30
- Redis (Managed)              $10-20
- Storage (S3/R2)              $5-10
- CDN (CloudFlare)             Free-$10

Services:
- Email (SendGrid)             Free-$20
- SMS (Twilio)                 $10-30
- Payment gateway fees         ~3.5% of transactions
- Domain                       $10-20/year

Total: $70-150/month (excluding transaction fees)

With 1000 orders/month at ฿175 average:
- Revenue: ฿175,000 (~$5000)
- Transaction fees (3.5%): ~$175
- Net infrastructure cost: ~1.5-3% of revenue
```

---

### 12. LEGAL & COMPLIANCE

```
✅ Implement Terms & Conditions enforcement
✅ PDPA compliance (already in Terms)
✅ Age verification (20+)
✅ KYC for high-value transactions
✅ AML checks
✅ Transaction limits
✅ User consent tracking
✅ Data retention policy
✅ Audit trail

⚠️ Consult lawyer for:
- Cross-border gambling laws
- Import/export regulations
- Tax implications
- Licensing requirements
```

---

## 🚀 IMMEDIATE ACTION ITEMS

### Priority 1: Critical
1. ✅ Legal terms (DONE)
2. 🔄 Backend setup (START NOW)
3. 🔄 Database schema (START NOW)
4. 🔄 Authentication (START NOW)
5. 🔄 Payment integration (CRITICAL)

### Priority 2: Core Features
6. Lotto order system
7. Email notifications
8. Draw result checking
9. Admin panel backend
10. Location tracking backend

### Priority 3: Enhancement
11. Marketplace backend
12. Seller dashboard
13. Analytics
14. Reports
15. Mobile app

---

## 📚 RECOMMENDED TECH STACK

```
Backend:
- Node.js 20+
- Express.js 4
- TypeScript 5
- PostgreSQL 16
- Redis 7
- Prisma ORM (or TypeORM)

Payment:
- Stripe
- Omise (Thai market)

Email:
- SendGrid

Queue:
- Bull MQ (Redis-based)

Testing:
- Jest
- Supertest

Deployment:
- Railway.app (recommended for MVP)
- Docker
- GitHub Actions (CI/CD)

Monitoring:
- Sentry (errors)
- Datadog / New Relic (performance)
- LogRocket (user sessions)
```

---

## 📝 NOTES

1. **Start with Lotto system** - This is the core differentiator
2. **Payment gateway is critical** - Test thoroughly
3. **USA agent required** - For actually buying tickets
4. **Legal consultation mandatory** - Before launch
5. **Email system crucial** - For user trust
6. **Admin tools first** - Make operations easy
7. **Mobile-first design** - Most traffic from mobile
8. **Cache heavily** - Jackpots, draw results, products
9. **Monitor everything** - Errors, performance, business metrics
10. **Start small, scale smart** - Don't over-engineer MVP

---

## 🎯 SUCCESS METRICS

```
Technical:
- 99.9% uptime
- < 2s page load time
- < 200ms API response time
- Zero payment failures
- 100% email delivery rate

Business:
- 1000+ registered users (Year 1)
- 100+ lotto orders/month
- $10K+ monthly revenue
- 4.5+ star rating
- < 2% customer complaints
```

---

**END OF DOCUMENT**

Generated: December 10, 2025  
Version: 1.0  
Status: Ready for Implementation
