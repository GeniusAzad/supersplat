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
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate

  3. Storage
    - Create storage bucket for splat files
    - Create storage bucket for thumbnails
    - Set up appropriate policies
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
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  file_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_featured boolean DEFAULT false,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  splat_id uuid NOT NULL REFERENCES splats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(splat_id, user_id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  splat_id uuid NOT NULL REFERENCES splats(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE splats ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Splats policies
CREATE POLICY "Splats are viewable by everyone"
  ON splats FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert splats"
  ON splats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own splats"
  ON splats FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own splats"
  ON splats FOR DELETE
  USING (auth.uid() = seller_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Authenticated users can insert purchases"
  ON purchases FOR INSERT
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
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('splats', 'splats', true),
  ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for splats bucket
CREATE POLICY "Anyone can view splat files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'splats');

CREATE POLICY "Authenticated users can upload splat files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'splats');

CREATE POLICY "Users can update their own splat files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'splats' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own splat files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'splats' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for thumbnails bucket
CREATE POLICY "Anyone can view thumbnail files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnail files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Users can update their own thumbnail files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own thumbnail files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_splats_updated_at
  BEFORE UPDATE ON splats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for development
INSERT INTO profiles (id, email, username, full_name, bio, is_seller) VALUES
  ('00000000-0000-0000-0000-000000000001', 'john@example.com', 'john_creator', 'John Smith', 'Professional 3D artist specializing in character modeling', true),
  ('00000000-0000-0000-0000-000000000002', 'sarah@example.com', 'sarah_designs', 'Sarah Johnson', 'Environmental artist and game developer', true),
  ('00000000-0000-0000-0000-000000000003', 'mike@example.com', 'mike_3d', 'Mike Chen', 'Architectural visualization specialist', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO splats (title, description, price, file_url, category, tags, seller_id, is_featured, download_count) VALUES
  ('Realistic Human Character', 'High-quality 3D scan of a human character with detailed facial features', 29.99, 'https://example.com/character.ply', 'Characters', ARRAY['human', 'character', 'realistic'], '00000000-0000-0000-0000-000000000001', true, 156),
  ('Modern Office Environment', 'Complete office space with furniture and lighting', 49.99, 'https://example.com/office.ply', 'Environments', ARRAY['office', 'interior', 'modern'], '00000000-0000-0000-0000-000000000002', true, 89),
  ('Vintage Car Model', 'Classic 1960s sports car with detailed interior', 39.99, 'https://example.com/car.ply', 'Vehicles', ARRAY['car', 'vintage', 'sports'], '00000000-0000-0000-0000-000000000003', false, 234),
  ('Fantasy Sword', 'Ornate medieval sword with magical effects', 19.99, 'https://example.com/sword.ply', 'Objects', ARRAY['sword', 'fantasy', 'weapon'], '00000000-0000-0000-0000-000000000001', false, 67),
  ('Modern Architecture', 'Contemporary building exterior with glass facade', 59.99, 'https://example.com/building.ply', 'Architecture', ARRAY['building', 'modern', 'glass'], '00000000-0000-0000-0000-000000000002', true, 45),
  ('Forest Scene', 'Dense forest environment with various trees and vegetation', 34.99, 'https://example.com/forest.ply', 'Nature', ARRAY['forest', 'trees', 'nature'], '00000000-0000-0000-0000-000000000003', false, 123)
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (splat_id, user_id, rating, comment) VALUES
  ((SELECT id FROM splats WHERE title = 'Realistic Human Character'), '00000000-0000-0000-0000-000000000002', 5, 'Amazing quality! Perfect for my game project.'),
  ((SELECT id FROM splats WHERE title = 'Modern Office Environment'), '00000000-0000-0000-0000-000000000001', 4, 'Great detail, exactly what I needed for my visualization.'),
  ((SELECT id FROM splats WHERE title = 'Vintage Car Model'), '00000000-0000-0000-0000-000000000002', 5, 'Incredible attention to detail. Worth every penny!'),
  ((SELECT id FROM splats WHERE title = 'Fantasy Sword'), '00000000-0000-0000-0000-000000000003', 4, 'Good quality model, fits perfectly in my fantasy scene.')
ON CONFLICT (splat_id, user_id) DO NOTHING;