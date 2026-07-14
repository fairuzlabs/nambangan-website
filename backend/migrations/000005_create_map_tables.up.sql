CREATE TABLE map_categories (
    id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name   VARCHAR(50) NOT NULL,
    slug   VARCHAR(50) UNIQUE NOT NULL,
    color  VARCHAR(20),
    icon   VARCHAR(50)
);

CREATE TABLE map_points (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id   UUID NOT NULL REFERENCES map_categories(id),
    name          VARCHAR(150) NOT NULL,
    subtitle      VARCHAR(150),
    description   TEXT,
    latitude      DECIMAL(10,7) NOT NULL,
    longitude     DECIMAL(10,7) NOT NULL,
    address       VARCHAR(255),
    image_url     VARCHAR(500),
    is_active     BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_map_points_category ON map_points(category_id);
CREATE INDEX idx_map_points_geo ON map_points(latitude, longitude);

CREATE TABLE map_point_umkm_details (
    map_point_id  UUID PRIMARY KEY REFERENCES map_points(id) ON DELETE CASCADE,
    price         DECIMAL(12,2),
    contact_phone VARCHAR(20),
    owner_name    VARCHAR(100)
);