CREATE TABLE tags (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name  VARCHAR(50) UNIQUE NOT NULL,
    slug  VARCHAR(50) UNIQUE NOT NULL
);