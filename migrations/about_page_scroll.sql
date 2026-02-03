-- Drop existing about_page table if exists
DROP TABLE IF EXISTS about_sections CASCADE;
DROP TABLE IF EXISTS about_page CASCADE;

-- Create about_page table
CREATE TABLE about_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_image TEXT NOT NULL,
  main_title TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create about_sections table
CREATE TABLE about_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_page_id UUID REFERENCES about_page(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('center', 'column', 'lines', 'sides', 'center-tall', 'grid')),
  title TEXT,
  text TEXT,
  images TEXT[] DEFAULT '{}',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_about_sections_page_id ON about_sections(about_page_id);
CREATE INDEX idx_about_sections_order ON about_sections("order");
CREATE INDEX idx_about_page_active ON about_page(is_active);

-- Enable RLS
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access" ON about_sections
  FOR SELECT USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Allow admin full access" ON about_page
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow admin full access" ON about_sections
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

-- Insert sample data (run this separately or adjust based on your needs)
-- Example:
-- INSERT INTO about_page (hero_image, main_title, is_active) VALUES
-- ('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', 'Your Name', true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_about_page_updated_at BEFORE UPDATE ON about_page
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default sample data
INSERT INTO about_page (hero_image, main_title, is_active) 
VALUES (
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
  'Your Name',
  true
);

-- Get the inserted about_page id for sections
DO $$
DECLARE
  page_id UUID;
BEGIN
  SELECT id INTO page_id FROM about_page WHERE is_active = true LIMIT 1;
  
  -- Insert sample sections
  INSERT INTO about_sections (about_page_id, type, title, text, images, "order") VALUES
  (page_id, 'center', 'Creative Developer', NULL, '{}', 0),
  (page_id, 'column', NULL, NULL, ARRAY[
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    'https://images.unsplash.com/photo-1558769132-cb1aea1f9665?w=400'
  ], 1),
  (page_id, 'lines', 'Building {{img}} Digital|Crafted with {{img}} passion|Modern {{img}} Solutions', NULL, ARRAY[
    '',
    'https://images.unsplash.com/photo-1558769132-cb1aea1f9665?w=400',
    'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=400'
  ], 2),
  (page_id, 'sides', NULL, '<strong>Welcome to my portfolio</strong> where innovation meets design. I believe in crafting more than just code—I create experiences that resonate with users and drive meaningful engagement.', '{}', 3),
  (page_id, 'center-tall', NULL, 'Every project is an opportunity to push boundaries, solve complex problems, and deliver solutions that make a real impact. I approach each challenge with creativity, precision, and dedication.', '{}', 4),
  (page_id, 'grid', NULL, NULL, ARRAY[
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=400',
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400',
    'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=400',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400',
    'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=400'
  ], 5);
END $$;
