CREATE TABLE podcast_categories (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name  VARCHAR(50) NOT NULL,
    slug  VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE podcast_episodes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) UNIQUE NOT NULL,
    description      TEXT,
    youtube_url      VARCHAR(500) NOT NULL,
    youtube_video_id VARCHAR(30),
    category_id      UUID REFERENCES podcast_categories(id),
    duration_seconds INT,
    published_at     TIMESTAMPTZ,
    is_featured      BOOLEAN DEFAULT false,
    created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_podcast_category ON podcast_episodes(category_id);

CREATE TABLE podcast_guests (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name  VARCHAR(100) NOT NULL,
    role  VARCHAR(150)
);

CREATE TABLE podcast_episode_guests (
    episode_id UUID REFERENCES podcast_episodes(id) ON DELETE CASCADE,
    guest_id   UUID REFERENCES podcast_guests(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, guest_id)
);