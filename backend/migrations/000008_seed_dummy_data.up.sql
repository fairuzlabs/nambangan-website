-- ========== ADMIN ==========
INSERT INTO admins (id, username, password_hash, display_name) VALUES
('11111111-1111-1111-1111-111111111111', 'admin', '$2a$10$dummyhashforseedonlyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Admin RW 18');

-- ========== TAGS ==========
INSERT INTO tags (id, name, slug) VALUES
('21111111-1111-1111-1111-111111111111', 'Gotong Royong', 'gotong-royong'),
('21111111-1111-1111-1111-111111111112', 'Kebersihan', 'kebersihan'),
('21111111-1111-1111-1111-111111111113', 'Adaptasi', 'adaptasi'),
('21111111-1111-1111-1111-111111111114', 'Mitigasi', 'mitigasi');

-- ========== NEWS CATEGORIES ==========
INSERT INTO news_categories (id, name, slug) VALUES
('31111111-1111-1111-1111-111111111111', 'Kegiatan', 'kegiatan'),
('31111111-1111-1111-1111-111111111112', 'Penghargaan', 'penghargaan'),
('31111111-1111-1111-1111-111111111113', 'UMKM', 'umkm'),
('31111111-1111-1111-1111-111111111114', 'Sosialisasi', 'sosialisasi');

-- ========== NEWS ==========
INSERT INTO news (title, slug, excerpt, content, image_url, category_id, author_id, status, published_at) VALUES
('Gotong Royong Bersih Lingkungan RW 18 Sukses Digelar', 'gotong-royong-bersih-lingkungan-rw-18',
 'Kegiatan gotong royong membersihkan lingkungan RW 18 diikuti oleh lebih dari 100 warga dengan penuh antusias.',
 'Kegiatan gotong royong membersihkan lingkungan RW 18 diikuti oleh lebih dari 100 warga dengan penuh antusias. Acara ini digelar dalam rangka menjaga kebersihan dan kenyamanan lingkungan warga RW 18 Nambangan.',
 'https://images.unsplash.com/photo-1565583673900-1cd9320f6c8b', '31111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'published', '2026-06-15 08:00:00+07'),

('Program Kampung Iklim (Proklim) RW 18 Raih Penghargaan', 'program-proklim-rw-18-raih-penghargaan',
 'RW 18 Nambangan berhasil meraih penghargaan tingkat kota untuk program Kampung Iklim yang berkelanjutan.',
 'RW 18 Nambangan berhasil meraih penghargaan tingkat kota untuk program Kampung Iklim yang berkelanjutan. Penghargaan ini diberikan atas komitmen warga dalam menjaga lingkungan.',
 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9', '31111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'published', '2026-06-05 08:00:00+07'),

('Pasar UMKM RW 18: Promosi Produk Lokal Berkualitas', 'pasar-umkm-rw-18-promosi-produk-lokal',
 'Pasar UMKM mingguan RW 18 menjadi wadah bagi pelaku usaha lokal untuk memasarkan produk unggulan mereka.',
 'Pasar UMKM mingguan RW 18 menjadi wadah bagi pelaku usaha lokal untuk memasarkan produk unggulan mereka. Kegiatan ini rutin digelar setiap akhir pekan.',
 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e', '31111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'published', '2026-06-20 08:00:00+07'),

('Sosialisasi Pengelolaan Sampah Rumah Tangga', 'sosialisasi-pengelolaan-sampah-rumah-tangga',
 'Warga RW 18 antusias mengikuti sosialisasi pemilahan dan pengelolaan sampah rumah tangga bersama kader lingkungan.',
 'Warga RW 18 antusias mengikuti sosialisasi pemilahan dan pengelolaan sampah rumah tangga bersama kader lingkungan. Kegiatan ini bertujuan meningkatkan kesadaran warga.',
 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b', '31111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'published', '2026-05-28 08:00:00+07');

-- ========== MAP CATEGORIES ==========
INSERT INTO map_categories (id, name, slug, color, icon) VALUES
('41111111-1111-1111-1111-111111111111', 'Proklim', 'proklim', '#166534', 'leaf'),
('41111111-1111-1111-1111-111111111112', 'UMKM', 'umkm', '#be185d', 'shopping-bag'),
('41111111-1111-1111-1111-111111111113', 'Kesenian', 'kesenian', '#b45309', 'music');

-- ========== MAP POINTS ==========
INSERT INTO map_points (id, category_id, name, subtitle, description, latitude, longitude, address, image_url) VALUES
('51111111-1111-1111-1111-111111111111', '41111111-1111-1111-1111-111111111111', 'Bank Sampah Mandiri RW 18', 'Pengelolaan Sampah',
 'Tempat pengelolaan dan pemilahan sampah warga RW 18 secara mandiri.', -7.470123, 110.217456, 'Jl. Sutopo, RW 18 Nambangan',
 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b'),

('51111111-1111-1111-1111-111111111112', '41111111-1111-1111-1111-111111111111', 'Taman Hidroponik Komunal', 'Pertanian Urban',
 'Lahan hidroponik komunal untuk budidaya sayuran tanpa tanah oleh warga.', -7.470567, 110.217890, 'Jl. Sutopo, RW 18 Nambangan',
 'https://images.unsplash.com/photo-1524598171348-a0794aa2f829'),

('51111111-1111-1111-1111-111111111113', '41111111-1111-1111-1111-111111111112', 'Keripik Tempe Original', 'Rp 15.000',
 'Produk keripik tempe khas buatan warga RW 18 dengan cita rasa original.', -7.470789, 110.218012, 'Jl. Sutopo, RW 18 Nambangan',
 'https://images.unsplash.com/photo-1601050690597-df0568f70950'),

('51111111-1111-1111-1111-111111111114', '41111111-1111-1111-1111-111111111113', 'Sanggar Tari Nambangan', 'Kesenian Tradisional',
 'Sanggar latihan tari tradisional untuk anak-anak dan remaja RW 18.', -7.470345, 110.217678, 'Jl. Sutopo, RW 18 Nambangan',
 'https://images.unsplash.com/photo-1518998053901-5348d3961a04');

-- ========== MAP POINT UMKM DETAILS ==========
INSERT INTO map_point_umkm_details (map_point_id, price, contact_phone, owner_name) VALUES
('51111111-1111-1111-1111-111111111113', 15000, '081234567890', 'Ibu Sri Wahyuni');

-- ========== PODCAST CATEGORIES ==========
INSERT INTO podcast_categories (id, name, slug) VALUES
('61111111-1111-1111-1111-111111111111', 'Pengelolaan Sampah', 'pengelolaan-sampah'),
('61111111-1111-1111-1111-111111111112', 'Pertanian Urban', 'pertanian-urban'),
('61111111-1111-1111-1111-111111111113', 'Konservasi Air', 'konservasi-air'),
('61111111-1111-1111-1111-111111111114', 'Edukasi Iklim', 'edukasi-iklim');

-- ========== PODCAST EPISODES (video YouTube asli & relevan) ==========
INSERT INTO podcast_episodes (id, title, slug, description, youtube_url, youtube_video_id, category_id, duration_seconds, published_at, is_featured) VALUES
('71111111-1111-1111-1111-111111111111', 'Mengenal Program Kampung Iklim Bersama Kader RW 18', 'mengenal-program-proklim-bersama-kader',
 'Obrolan santai bersama Tim Proklim RW 18 tentang perjalanan panjang membangun Kampung Iklim dari nol.',
 'https://www.youtube.com/watch?v=JdNju0V4zfE', 'JdNju0V4zfE', '61111111-1111-1111-1111-111111111114', 2100, '2026-06-01 08:00:00+07', true),

('71111111-1111-1111-1111-111111111112', 'Seri Bank Sampah: Dari Sampah Jadi Berkah', 'seri-bank-sampah-dari-sampah-jadi-berkah',
 'Membahas pengelolaan bank sampah RW 18 dan dampak ekonominya bagi warga.',
 'https://www.youtube.com/watch?v=1DESK9T6qvY', '1DESK9T6qvY', '61111111-1111-1111-1111-111111111111', 1680, '2026-05-15 08:00:00+07', false),

('71111111-1111-1111-1111-111111111113', 'Hidroponik untuk Semua: Berkebun Tanpa Tanah', 'hidroponik-untuk-semua-berkebun-tanpa-tanah',
 'Belajar teknik hidroponik sederhana yang bisa diterapkan warga di rumah masing-masing.',
 'https://www.youtube.com/watch?v=9l-ti-tT9xw', '9l-ti-tT9xw', '61111111-1111-1111-1111-111111111112', 2460, '2026-05-01 08:00:00+07', false),

('71111111-1111-1111-1111-111111111114', 'Biopori dan Sumur Resapan: Solusi Banjir Warga', 'biopori-dan-sumur-resapan-solusi-banjir',
 'Diskusi teknis pembuatan biopori dan sumur resapan untuk mencegah genangan air.',
 'https://www.youtube.com/watch?v=YOC3UnoHGQU', 'YOC3UnoHGQU', '61111111-1111-1111-1111-111111111113', 1500, '2026-04-15 08:00:00+07', false),

('71111111-1111-1111-1111-111111111115', 'Mitigasi Perubahan Iklim: Apa yang Bisa Kita Lakukan?', 'mitigasi-perubahan-iklim-apa-yang-bisa-kita-lakukan',
 'Penjelasan sederhana tentang pemanasan global, perubahan iklim, dan aksi nyata yang bisa dilakukan warga.',
 'https://www.youtube.com/watch?v=0Q048ipzMsg', '0Q048ipzMsg', '61111111-1111-1111-1111-111111111114', 1320, '2026-04-01 08:00:00+07', false);

-- ========== PODCAST GUESTS ==========
INSERT INTO podcast_guests (id, name, role) VALUES
('81111111-1111-1111-1111-111111111111', 'Bapak Sutrisno', 'Ketua Tim Proklim RW 18'),
('81111111-1111-1111-1111-111111111112', 'Ibu Endang', 'Koordinator Bank Sampah'),
('81111111-1111-1111-1111-111111111113', 'Bapak Wahyu', 'Petani Hidroponik'),
('81111111-1111-1111-1111-111111111114', 'Ibu Retno', 'Kader Lingkungan RW 18');

-- ========== PODCAST EPISODE GUESTS ==========
INSERT INTO podcast_episode_guests (episode_id, guest_id) VALUES
('71111111-1111-1111-1111-111111111111', '81111111-1111-1111-1111-111111111111'),
('71111111-1111-1111-1111-111111111112', '81111111-1111-1111-1111-111111111112'),
('71111111-1111-1111-1111-111111111113', '81111111-1111-1111-1111-111111111113'),
('71111111-1111-1111-1111-111111111114', '81111111-1111-1111-1111-111111111114');

-- ========== ARCHIVE DOCUMENTS ==========
INSERT INTO archive_documents (id, title, description, doc_type, program_type, activity_date) VALUES
('91111111-1111-1111-1111-111111111111', 'Dokumentasi Kegiatan Gotong Royong Bersih Lingkungan Juni 2026',
 'Kumpulan foto kegiatan gotong royong membersihkan lingkungan RW 18 yang diikuti lebih dari 100 warga pada 15 Juni 2026.',
 'foto', 'adaptasi', '2026-06-15'),

('91111111-1111-1111-1111-111111111112', 'Laporan Program Kampung Iklim Triwulan II 2026',
 'Laporan resmi kegiatan dan capaian Program Kampung Iklim RW 18 selama triwulan kedua tahun 2026.',
 'pdf', 'mitigasi', '2026-06-30'),

('91111111-1111-1111-1111-111111111113', 'Catatan Kegiatan Sosialisasi Pengelolaan Sampah',
 'Catatan ringkas jalannya kegiatan sosialisasi pemilahan sampah rumah tangga bersama warga.',
 'catatan', 'adaptasi', '2026-05-28'),

('91111111-1111-1111-1111-111111111114', 'Laporan Pembangunan Sumur Resapan Balai RW',
 'Laporan teknis pembangunan sumur resapan sebagai upaya konservasi air di wilayah RW 18.',
 'pdf', 'mitigasi', '2026-04-20');

-- ========== ARCHIVE FILES (foto Unsplash asli, bukan link mati) ==========
INSERT INTO archive_files (document_id, file_url, file_type, file_name, sort_order) VALUES
('91111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1560840067-ddcaeb7831d2', 'image', 'gotong-royong-1.jpg', 1),
('91111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5', 'image', 'gotong-royong-2.jpg', 2),
('91111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba6', 'image', 'gotong-royong-3.jpg', 3),
('91111111-1111-1111-1111-111111111112', 'https://www.africau.edu/images/default/sample.pdf', 'pdf', 'laporan-proklim-q2-2026.pdf', 1),
('91111111-1111-1111-1111-111111111114', 'https://www.africau.edu/images/default/sample.pdf', 'pdf', 'laporan-sumur-resapan.pdf', 1);

-- ========== ARCHIVE DOCUMENT TAGS ==========
INSERT INTO archive_document_tags (document_id, tag_id) VALUES
('91111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111'),
('91111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112'),
('91111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111113'),
('91111111-1111-1111-1111-111111111112', '21111111-1111-1111-1111-111111111114'),
('91111111-1111-1111-1111-111111111113', '21111111-1111-1111-1111-111111111113'),
('91111111-1111-1111-1111-111111111114', '21111111-1111-1111-1111-111111111114');