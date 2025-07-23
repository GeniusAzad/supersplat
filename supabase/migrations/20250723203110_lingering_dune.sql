/*
  # Create 3D Gaussian Splats Marketplace Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `username` (text, unique)
      - `full_name` (text, optional)
      - `avatar_url` (text, optional)
      - `bio` (text, optional)
      - `website` (text, optional)
      - `is_seller` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `splats`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `price` (decimal)
      - `file_url` (text)
      - `thumbnail_url` (text, optional)
      - `category` (text)
      - `tags` (text array)
      - `seller_id` (uuid, references profiles)
      - `is_featured` (boolean, default false)
      - `download_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `splat_id` (uuid, references splats)
      - `user_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `comment` (text, optional)
      - `created_at` (timestamp)

    - `purchases`
      - `id` (uuid, primary key)
      - `splat_id` (uuid, references splats)
      - `buyer_id` (uuid, references profiles)
      - `seller_id` (uuid, references profiles)
      - `amount` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for public read access to splats and reviews
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  is_seller boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create splats table
CREATE TABLE IF NOT EXISTS splats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  file_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  is_featured boolean DEFAULT false,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  splat_id uuid REFERENCES splats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(splat_id, user_id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  splat_id uuid REFERENCES splats(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE splats ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Splats policies
CREATE POLICY "Anyone can read splats"
  ON splats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sellers can insert splats"
  ON splats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own splats"
  ON splats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own splats"
  ON splats
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "Users can read own purchases"
  ON purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can insert purchases"
  ON purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_splats_seller_id ON splats(seller_id);
CREATE INDEX IF NOT EXISTS idx_splats_category ON splats(category);
CREATE INDEX IF NOT EXISTS idx_splats_created_at ON splats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_splats_is_featured ON splats(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_splat_id ON reviews(splat_id);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer_id ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_seller_id ON purchases(seller_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('splats', 'splats', true),
  ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view splat files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'splats');

CREATE POLICY "Authenticated users can upload splat files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'splats');

CREATE POLICY "Users can update own splat files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'splats' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_splats_updated_at
  BEFORE UPDATE ON splats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();