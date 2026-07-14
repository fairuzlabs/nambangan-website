CREATE TABLE archive_documents (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    doc_type      VARCHAR(30) NOT NULL,
    program_type  VARCHAR(30),
    activity_date DATE,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE archive_files (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id  UUID REFERENCES archive_documents(id) ON DELETE CASCADE,
    file_url     VARCHAR(500) NOT NULL,
    file_type    VARCHAR(20),
    file_name    VARCHAR(255),
    sort_order   INT DEFAULT 0
);

CREATE INDEX idx_archive_files_doc ON archive_files(document_id);

CREATE TABLE archive_document_tags (
    document_id UUID REFERENCES archive_documents(id) ON DELETE CASCADE,
    tag_id      UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (document_id, tag_id)
);