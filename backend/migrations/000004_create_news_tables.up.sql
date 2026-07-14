CREATE TABLE news_categories (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name  VARCHAR(50) NOT NULL,
    slug  VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE news (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) UNIQUE NOT NULL,
    excerpt       VARCHAR(500) NOT NULL,
    content       TEXT NOT NULL,
    image_url     VARCHAR(500),
    category_id   UUID REFERENCES news_categories(id),
    author_id     UUID REFERENCES admins(id),
    status        VARCHAR(20) DEFAULT 'published',
    published_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_news_category ON news(category_id);
CREATE INDEX idx_news_published ON news(published_at DESC) WHERE status='published';