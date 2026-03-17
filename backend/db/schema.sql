-- MemoryBook Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  avatar_url VARCHAR(500),
  auth_provider VARCHAR(50) DEFAULT 'email',
  google_id VARCHAR(255),
  instagram_id VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user',
  is_influencer BOOLEAN DEFAULT FALSE,
  follower_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scrapbooks
CREATE TABLE scrapbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  theme VARCHAR(50) DEFAULT 'minimal',
  font VARCHAR(50) DEFAULT 'sans',
  is_public BOOLEAN DEFAULT FALSE,
  likes_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  page_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scrapbook_id UUID REFERENCES scrapbooks(id) ON DELETE CASCADE,
  original_url VARCHAR(500) NOT NULL,
  compressed_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  width INT,
  height INT,
  file_size INT,
  source VARCHAR(50) DEFAULT 'upload',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scrapbook_id UUID REFERENCES scrapbooks(id) ON DELETE CASCADE,
  page_number INT NOT NULL,
  layout VARCHAR(50) DEFAULT 'full',
  caption TEXT,
  stickers JSONB DEFAULT '[]',
  location JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page Photos (junction)
CREATE TABLE page_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  position INT DEFAULT 0,
  x FLOAT DEFAULT 0,
  y FLOAT DEFAULT 0,
  width FLOAT DEFAULT 100,
  height FLOAT DEFAULT 100,
  rotation FLOAT DEFAULT 0
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scrapbook_id UUID REFERENCES scrapbooks(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  page_count INT NOT NULL,
  cover_type VARCHAR(20) DEFAULT 'soft',
  gift_wrap BOOLEAN DEFAULT FALSE,
  express_delivery BOOLEAN DEFAULT FALSE,
  subtotal DECIMAL(10,2),
  total DECIMAL(10,2),
  status VARCHAR(30) DEFAULT 'confirmed',
  shipping_name VARCHAR(255),
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_zip VARCHAR(20),
  tracking_number VARCHAR(100),
  payment_intent_id VARCHAR(255),
  payment_status VARCHAR(20) DEFAULT 'demo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  layout_config JSONB DEFAULT '{}',
  theme_config JSONB DEFAULT '{}',
  use_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Followers
CREATE TABLE followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id)
);

-- Indexes
CREATE INDEX idx_scrapbooks_user ON scrapbooks(user_id);
CREATE INDEX idx_scrapbooks_public ON scrapbooks(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_photos_scrapbook ON photos(scrapbook_id);
CREATE INDEX idx_pages_scrapbook ON pages(scrapbook_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
