-- ============================================================================
-- PostgreSQL Initialization Script
-- Sets up pgvector extension and useful functions
-- ============================================================================

-- Create pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Display installed extensions
SELECT * FROM pg_extension;
