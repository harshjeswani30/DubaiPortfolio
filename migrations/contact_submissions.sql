-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submissions_timestamp
BEFORE UPDATE ON contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_contact_submissions_updated_at();
