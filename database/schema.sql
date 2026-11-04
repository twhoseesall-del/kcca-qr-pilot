-- Inferred from the query in backend/server.js. Adjust to match your earlier schema if different.
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS landmarks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    heritage_text TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    qr_shortlink TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT'  -- e.g. DRAFT / PUBLISHED
);

-- Sample record matching the frontend's default test ID
INSERT INTO landmarks (name, heritage_text, location, qr_shortlink, status)
VALUES (
    'Sample Landmark',
    'Replace with verified heritage text.',
    ST_SetSRID(ST_MakePoint(32.5825, 0.3476), 4326),
    'KCCA-NKS-001',
    'PUBLISHED'
) ON CONFLICT (qr_shortlink) DO NOTHING;
