CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO organization_members (position, name) VALUES
('Ketua RW', 'Bapak Suryanto'),
('Ketua Proklim', 'Ibu Siti Nurjanah'),
('Ketua Karang Taruna', 'Bapak Ahmad Fauzi');
