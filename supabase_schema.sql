-- SQL query to create the generated_images table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create an index on created_at for faster queries when ordering by date
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at DESC);

-- Optional: Enable Row Level Security (RLS) if you want to add authentication later
-- ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Optional: Create a policy to allow all operations (adjust based on your security needs)
-- CREATE POLICY "Allow all operations" ON generated_images FOR ALL USING (true) WITH CHECK (true);

-- Optional: Add a comment to the table
COMMENT ON TABLE generated_images IS 'Stores generated AI images with their prompts and metadata';
