-- Create admin_credentials table
CREATE TABLE IF NOT EXISTS admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin credentials
-- Email: harshjeswani30@gmail.com
-- Password: Harsh0000..
-- Hashed using bcrypt with 10 rounds
INSERT INTO admin_credentials (email, password_hash)
VALUES ('harshjeswani30@gmail.com', '$2b$10$zIBA.tuaoe5azrBfrJT5neQTZTZraV1F6yfA2rpXh0uEezGqcpKYq')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Note: The password hash above is for "Harsh0000.."
-- To generate a new hash, use bcryptjs in Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('YourPassword', 10);
