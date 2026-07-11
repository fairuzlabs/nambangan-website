export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

export interface ProklimLocation {
  id: string;
  name: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  image: string;
  activities: string[];
}

export interface UMKMProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  seller: string;
  contact: string;
  lat: number;
  lng: number;
}

export interface KesenianLocation {
  id: string;
  name: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  image: string;
  schedule: string;
  activities: string[];
  contact?: string;
}

export const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Gotong Royong Bersih Lingkungan RW 18 Sukses Digelar",
    excerpt: "Kegiatan gotong royong membersihkan lingkungan RW 18 diikuti oleh lebih dari 100 warga dengan penuh antusias.",
    content: `Kegiatan gotong royong membersihkan lingkungan RW 18 yang digelar pada hari Minggu, 15 Juni 2026, mendapat sambutan positif dari warga. Lebih dari 100 warga dari berbagai RT turut berpartisipasi dalam kegiatan ini.

Acara dimulai pukul 07.00 WIB dengan pembukaan oleh Ketua RW 18, Bapak Suryanto. Warga kemudian dibagi menjadi beberapa kelompok untuk membersihkan area-area strategis seperti jalan utama, taman lingkungan, dan saluran air.

"Saya sangat senang melihat antusiasme warga dalam menjaga kebersihan lingkungan kita. Ini adalah bukti bahwa semangat gotong royong masih kuat di RW 18," ujar Pak Suryanto.

Kegiatan berlangsung hingga pukul 10.00 WIB dan ditutup dengan makan bersama yang dihadiri oleh seluruh peserta. Rencana ke depan, kegiatan serupa akan diadakan setiap bulan untuk menjaga kebersihan dan keindahan lingkungan RW 18.`,
    image: "https://images.unsplash.com/photo-1533734635438-fa92e72a1f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwdmlsbGFnZSUyMGNvbW11bml0eSUyMG1lZXRpbmd8ZW58MXx8fHwxNzgyODAwNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2026-06-15",
    category: "Kegiatan",
    author: "Admin RW 18"
  },
  {
    id: "2",
    title: "Program Kampung Iklim (Proklim) RW 18 Raih Penghargaan",
    excerpt: "RW 18 Nambangan berhasil meraih penghargaan tingkat kota untuk program Kampung Iklim yang berkelanjutan.",
    content: `RW 18 Nambangan Rejowinangun Utara berhasil meraih penghargaan tingkat Kota Magelang untuk Program Kampung Iklim (Proklim) yang telah dijalankan sejak tahun 2024.

Penghargaan ini diberikan oleh Walikota Magelang pada acara peringatan Hari Lingkungan Hidup, 5 Juni 2026. RW 18 dinilai berhasil mengimplementasikan berbagai program adaptasi dan mitigasi perubahan iklim dengan baik.

Beberapa program unggulan yang dinilai antara lain:
- Bank Sampah Mandiri yang mengelola sampah warga
- Taman Hidroponik Komunal yang menyediakan sayuran segar
- Program Biopori untuk penyerapan air hujan
- Sumur Resapan di berbagai titik RW

Ketua Tim Proklim RW 18, Ibu Siti Nurjanah, mengungkapkan rasa syukurnya. "Ini adalah pencapaian bersama seluruh warga RW 18. Kami akan terus berkomitmen menjaga lingkungan untuk generasi mendatang."

Penghargaan ini juga disertai dengan dana pembinaan sebesar Rp 25 juta yang akan digunakan untuk pengembangan program Proklim lebih lanjut.`,
    image: "https://images.unsplash.com/photo-1760009449712-09befce78964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjBlbnZpcm9ubWVudGFsfGVufDF8fHx8MTc4MjgwMDQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2026-06-05",
    category: "Penghargaan",
    author: "Admin RW 18"
  },
  {
    id: "3",
    title: "Pasar UMKM RW 18: Promosi Produk Lokal Berkualitas",
    excerpt: "Pasar UMKM mingguan RW 18 menjadi wadah bagi pelaku usaha lokal untuk memasarkan produk unggulan mereka.",
    content: `Pasar UMKM RW 18 yang diadakan setiap hari Sabtu sore di halaman balai RW terus menunjukkan perkembangan positif. Kegiatan yang dimulai sejak Januari 2026 ini kini telah memiliki 25 pelaku UMKM yang rutin berjualan.

Berbagai produk unggulan ditawarkan, mulai dari makanan tradisional, kerajinan tangan, batik, hingga produk pertanian organik. Warga tidak hanya dari RW 18 tetapi juga dari wilayah sekitar mulai berdatangan untuk berbelanja.

"Pasar UMKM ini sangat membantu kami para pelaku usaha kecil. Kami bisa langsung berinteraksi dengan pembeli dan memperkenalkan produk kami," ujar Ibu Sri, penjual keripik tempe yang menjadi salah satu produk favorit.

Ketua RW 18 berharap pasar UMKM ini bisa terus berkembang dan menjadi pusat ekonomi kreatif warga. Rencana ke depan akan dibuat platform digital untuk memudahkan transaksi dan promosi produk UMKM RW 18.

Pasar UMKM dibuka setiap Sabtu pukul 15.00-18.00 WIB. Warga yang ingin berjualan bisa mendaftar melalui pengurus RW tanpa biaya administrasi.`,
    image: "https://images.unsplash.com/photo-1527383214149-cb7be04ae387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwaGFuZGljcmFmdHMlMjBwcm9kdWN0c3xlbnwxfHx8fDE3ODI4MDA0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2026-06-20",
    category: "UMKM",
    author: "Admin RW 18"
  },
  {
    id: "4",
    title: "Sosialisasi Pemilahan Sampah untuk Warga RW 18",
    excerpt: "Tim Proklim RW 18 mengadakan sosialisasi pemilahan sampah organik dan anorganik untuk seluruh warga.",
    content: `Tim Proklim RW 18 mengadakan sosialisasi pemilahan sampah pada Kamis, 27 Juni 2026 di Balai RW. Kegiatan ini dihadiri oleh perwakilan dari setiap RT untuk kemudian disebarluaskan ke warga masing-masing.

Materi sosialisasi mencakup:
1. Pentingnya pemilahan sampah dari sumber
2. Cara memilah sampah organik, anorganik, dan B3
3. Manfaat ekonomi dari pemilahan sampah
4. Prosedur penyetoran ke Bank Sampah RW 18

Narasumber dari Dinas Lingkungan Hidup Kota Magelang, Bapak Dwi Santoso, menjelaskan bahwa pemilahan sampah dari rumah tangga sangat penting untuk mengurangi volume sampah yang masuk ke TPA.

"Dengan memilah sampah, kita tidak hanya membantu lingkungan tetapi juga bisa mendapat nilai ekonomis. Sampah yang sudah dipilah bisa dijual ke bank sampah dengan harga yang lebih baik," jelasnya.

Setiap peserta mendapat starter kit berupa 3 tempat sampah warna berbeda dan panduan pemilahan sampah yang akan dibagikan ke seluruh warga RW 18. Pengurus RW berharap program ini dapat meningkatkan kesadaran warga dalam pengelolaan sampah rumah tangga.`,
    image: "https://images.unsplash.com/photo-1761055469056-8eb6aedda57d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYWdlJTIwYW5ub3VuY2VtZW50JTIwYm9hcmR8ZW58MXx8fHwxNzgyODAwNDc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2026-06-27",
    category: "Sosialisasi",
    author: "Admin RW 18"
  }
];

export const proklimData: ProklimLocation[] = [
  {
    id: "1",
    name: "Bank Sampah Mandiri RW 18",
    description: "Pusat pengelolaan dan pengumpulan sampah terpilah dari warga RW 18. Bank sampah ini melayani penyetoran sampah setiap hari Rabu dan Sabtu.",
    category: "Pengelolaan Sampah",
    lat: -7.479167,
    lng: 110.217778,
    image: "https://images.unsplash.com/photo-1760009449712-09befce78964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjBlbnZpcm9ubWVudGFsfGVufDF8fHx8MTc4MjgwMDQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    activities: [
      "Penyetoran sampah terpilah",
      "Pembuatan kompos",
      "Edukasi pemilahan sampah",
      "Tabungan sampah warga"
    ]
  },
  {
    id: "2",
    name: "Taman Hidroponik Komunal",
    description: "Taman hidroponik yang dikelola bersama oleh warga untuk menanam sayuran segar organik. Hasil panen dibagi untuk konsumsi warga dan dijual di pasar UMKM.",
    category: "Pertanian Urban",
    lat: -7.478889,
    lng: 110.218056,
    image: "https://images.unsplash.com/photo-1533734635438-fa92e72a1f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwdmlsbGFnZSUyMGNvbW11bml0eSUyMG1lZXRpbmd8ZW58MXx8fHwxNzgyODAwNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    activities: [
      "Penanaman sayuran hidroponik",
      "Pelatihan berkebun",
      "Panen bersama",
      "Distribusi hasil panen"
    ]
  },
  {
    id: "3",
    name: "Titik Biopori Wilayah Utara",
    description: "Cluster biopori yang dibuat untuk meningkatkan penyerapan air hujan dan mengurangi genangan. Terdapat 50 lubang biopori di area ini.",
    category: "Konservasi Air",
    lat: -7.478611,
    lng: 110.217500,
    image: "https://images.unsplash.com/photo-1761055469056-8eb6aedda57d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYWdlJTIwYW5ub3VuY2VtZW50JTIwYm9hcmR8ZW58MXx8fHwxNzgyODAwNDc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    activities: [
      "Pembuatan lubang biopori",
      "Pemeliharaan biopori",
      "Monitoring penyerapan air",
      "Edukasi konservasi air"
    ]
  },
  {
    id: "4",
    name: "Sumur Resapan Balai RW",
    description: "Sumur resapan berkapasitas besar yang terletak di halaman Balai RW untuk menampung air hujan dan mencegah banjir.",
    category: "Konservasi Air",
    lat: -7.479444,
    lng: 110.218333,
    image: "https://images.unsplash.com/photo-1533734635438-fa92e72a1f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwdmlsbGFnZSUyMGNvbW11bml0eSUyMG1lZXRpbmd8ZW58MXx8fHwxNzgyODAwNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    activities: [
      "Penampungan air hujan",
      "Peresapan air ke tanah",
      "Pencegahan banjir",
      "Pengisian air tanah"
    ]
  },
  {
    id: "5",
    name: "Taman Toga (Tanaman Obat Keluarga)",
    description: "Taman tanaman obat tradisional yang dapat dimanfaatkan oleh seluruh warga untuk kesehatan keluarga.",
    category: "Kesehatan & Lingkungan",
    lat: -7.479722,
    lng: 110.218611,
    image: "https://images.unsplash.com/photo-1760009449712-09befce78964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjBlbnZpcm9ubWVudGFsfGVufDF8fHx8MTc4MjgwMDQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    activities: [
      "Penanaman tanaman obat",
      "Edukasi manfaat toga",
      "Pembuatan jamu tradisional",
      "Pemanfaatan tanaman obat"
    ]
  }
];

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  host: string;
  category: string;
  platform: "youtube" | "spotify";
  embedId: string;
  thumbnail: string;
  tags: string[];
}

export interface ArsipItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  type: "foto" | "laporan" | "catatan";
  images?: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  kegiatan: string;
  tags: string[];
}

export const podcastData: PodcastEpisode[] = [
  {
    id: "1",
    title: "Mengenal Program Kampung Iklim Bersama Kader RW 18",
    description: "Obrolan santai bersama Tim Proklim RW 18 tentang perjalanan panjang membangun Kampung Iklim dari nol, tantangan yang dihadapi, dan harapan ke depan untuk generasi mendatang.",
    date: "2026-06-01",
    duration: "32 menit",
    host: "Ibu Siti Nurjanah & Tim Proklim",
    category: "Proklim",
    platform: "youtube",
    embedId: "jNQXAC9IVRw",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tags: ["Proklim", "Lingkungan", "Kampung Iklim"]
  },
  {
    id: "2",
    title: "Seri Bank Sampah: Dari Sampah Jadi Berkah",
    description: "Diskusi mendalam tentang pengelolaan Bank Sampah Mandiri RW 18 — bagaimana sampah rumah tangga bisa menjadi sumber penghasilan tambahan dan sekaligus menjaga kelestarian lingkungan.",
    date: "2026-05-15",
    duration: "28 menit",
    host: "Bapak Rudi Hartono",
    category: "Pengelolaan Sampah",
    platform: "youtube",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tags: ["Bank Sampah", "Daur Ulang", "Ekonomi Sirkular"]
  },
  {
    id: "3",
    title: "Hidroponik untuk Semua: Berkebun Tanpa Tanah",
    description: "Warga RW 18 berbagi pengalaman sukses menjalankan Taman Hidroponik Komunal — dari teknik sederhana hingga panen perdana yang membanggakan seluruh lingkungan.",
    date: "2026-05-01",
    duration: "41 menit",
    host: "Kelompok Tani RW 18",
    category: "Pertanian Urban",
    platform: "youtube",
    embedId: "jNQXAC9IVRw",
    thumbnail: "https://images.unsplash.com/photo-1604598585777-7b2c0fd86a02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tags: ["Hidroponik", "Pertanian Urban", "Ketahanan Pangan"]
  },
  {
    id: "4",
    title: "Biopori dan Sumur Resapan: Solusi Banjir Warga",
    description: "Penjelasan teknis dan praktis tentang manfaat biopori dan sumur resapan yang telah dipasang di berbagai titik RW 18, serta dampaknya terhadap pengurangan genangan air.",
    date: "2026-04-15",
    duration: "25 menit",
    host: "Bapak Dwi Santoso (DLH Kota Magelang)",
    category: "Konservasi Air",
    platform: "youtube",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1518738617820-fb8e4d86fd54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tags: ["Biopori", "Konservasi Air", "Banjir"]
  },
  {
    id: "5",
    title: "Tanaman Obat Keluarga: Apotik Hidup di Pekarangan",
    description: "Cara mudah menanam dan memanfaatkan tanaman obat keluarga (TOGA) yang tumbuh subur di Taman Toga RW 18, disertai tips pengolahan jamu tradisional untuk kesehatan keluarga.",
    date: "2026-04-01",
    duration: "37 menit",
    host: "Ibu Endang Susilowati",
    category: "Kesehatan & Lingkungan",
    platform: "youtube",
    embedId: "jNQXAC9IVRw",
    thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tags: ["TOGA", "Jamu", "Kesehatan"]
  },
  {
    id: "6",
    title: "Mitigasi Perubahan Iklim: Apa yang Bisa Kita Lakukan?",
    description: "Sesi edukasi bersama narasumber dari Universitas Tidar Magelang membahas perubahan iklim dari perspektif ilmiah dan langkah-langkah konkret yang bisa dilakukan di tingkat RW.",
    date: "2026-03-15",
    duration: "55 menit",
    host: "Dr. Ahmad Fauzi (Universitas Tidar)",
    category: "Edukasi Iklim",
    platform: "youtube",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    tags: ["Perubahan Iklim", "Mitigasi", "Edukasi"]
  }
];

export const arsipData: ArsipItem[] = [
  {
    id: "1",
    title: "Dokumentasi Kegiatan Gotong Royong Bersih Lingkungan Juni 2026",
    description: "Kumpulan foto kegiatan gotong royong membersihkan lingkungan RW 18 yang diikuti lebih dari 100 warga pada 15 Juni 2026.",
    date: "2026-06-15",
    category: "Adaptasi",
    type: "foto",
    kegiatan: "Kebersihan Lingkungan",
    images: [
      "https://images.unsplash.com/photo-1533734635438-fa92e72a1f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      "https://images.unsplash.com/photo-1526951521990-620dc14c214b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80"
    ],
    tags: ["Gotong Royong", "Kebersihan", "Adaptasi"]
  },
  {
    id: "2",
    title: "Laporan Tahunan Program Kampung Iklim RW 18 Tahun 2025",
    description: "Laporan komprehensif seluruh kegiatan Proklim sepanjang tahun 2025, mencakup indikator adaptasi dan mitigasi, capaian program, serta rencana kerja tahun berikutnya.",
    date: "2026-01-10",
    category: "Mitigasi",
    type: "laporan",
    kegiatan: "Pelaporan Proklim",
    fileUrl: "#",
    fileName: "Laporan_Proklim_RW18_2025.pdf",
    fileSize: "2.4 MB",
    tags: ["Laporan Tahunan", "Proklim", "Mitigasi"]
  },
  {
    id: "3",
    title: "Dokumentasi Panen Perdana Taman Hidroponik Komunal",
    description: "Momen bersejarah panen perdana Taman Hidroponik Komunal RW 18 yang dihadiri seluruh kelompok tani dan pengurus RW.",
    date: "2026-05-20",
    category: "Adaptasi",
    type: "foto",
    kegiatan: "Pertanian Urban",
    images: [
      "https://images.unsplash.com/photo-1604598585777-7b2c0fd86a02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80"
    ],
    tags: ["Hidroponik", "Panen", "Pertanian Urban"]
  },
  {
    id: "4",
    title: "Catatan Kegiatan Sosialisasi Pemilahan Sampah",
    description: "Notulensi dan catatan lengkap kegiatan sosialisasi pemilahan sampah bersama narasumber dari DLH Kota Magelang. Mencakup materi, tanya jawab, dan komitmen peserta.",
    date: "2026-06-27",
    category: "Mitigasi",
    type: "catatan",
    kegiatan: "Pengelolaan Sampah",
    fileUrl: "#",
    fileName: "Notulensi_Sosialisasi_Sampah_Juni2026.pdf",
    fileSize: "1.1 MB",
    tags: ["Sosialisasi", "Sampah", "Notulensi"]
  },
  {
    id: "5",
    title: "Laporan Monitoring Biopori dan Sumur Resapan Semester I 2026",
    description: "Hasil monitoring kondisi dan efektivitas 50 titik biopori serta 3 sumur resapan di wilayah RW 18 selama Januari–Juni 2026.",
    date: "2026-06-30",
    category: "Adaptasi",
    type: "laporan",
    kegiatan: "Konservasi Air",
    fileUrl: "#",
    fileName: "Monitoring_Biopori_S1_2026.pdf",
    fileSize: "3.2 MB",
    tags: ["Biopori", "Monitoring", "Konservasi Air"]
  },
  {
    id: "6",
    title: "Dokumentasi Penanaman 100 Pohon Bersama Warga",
    description: "Kegiatan penanaman 100 pohon di jalur hijau RW 18 sebagai bagian dari program penghijauan dan mitigasi perubahan iklim.",
    date: "2026-04-22",
    category: "Mitigasi",
    type: "foto",
    kegiatan: "Penghijauan",
    images: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80"
    ],
    tags: ["Penghijauan", "Pohon", "Mitigasi"]
  },
  {
    id: "7",
    title: "Catatan Rapat Koordinasi Tim Proklim Mei 2026",
    description: "Notulensi rapat koordinasi bulanan Tim Proklim RW 18, membahas evaluasi program berjalan dan perencanaan kegiatan bulan berikutnya.",
    date: "2026-05-10",
    category: "Adaptasi",
    type: "catatan",
    kegiatan: "Koordinasi",
    fileUrl: "#",
    fileName: "Notulensi_Rapat_Proklim_Mei2026.pdf",
    fileSize: "0.8 MB",
    tags: ["Rapat", "Koordinasi", "Proklim"]
  },
  {
    id: "8",
    title: "Laporan Penilaian Proklim oleh DLH Kota Magelang",
    description: "Dokumen resmi hasil penilaian Program Kampung Iklim RW 18 oleh tim penilai Dinas Lingkungan Hidup Kota Magelang tahun 2025.",
    date: "2025-11-20",
    category: "Mitigasi",
    type: "laporan",
    kegiatan: "Penilaian DLH",
    fileUrl: "#",
    fileName: "Hasil_Penilaian_DLH_2025.pdf",
    fileSize: "5.7 MB",
    tags: ["Penilaian", "DLH", "Resmi"]
  }
];

export const umkmData: UMKMProduct[] = [
  {
    id: "1",
    name: "Keripik Tempe Original",
    description: "Keripik tempe renyah dengan bumbu original yang gurih. Terbuat dari tempe kedelai pilihan dan bumbu rempah tradisional.",
    price: "Rp 15.000",
    image: "https://images.unsplash.com/photo-1539755530862-00f623c00f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwdHJhZGl0aW9uYWwlMjBmb29kfGVufDF8fHx8MTc4MjgwMDQ3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Makanan",
    seller: "Ibu Sri Wahyuni",
    contact: "0812-3456-7890",
    lat: -7.4790, lng: 110.2175
  },
  {
    id: "2",
    name: "Batik Tulis Motif Magelang",
    description: "Batik tulis dengan motif khas Magelang. Dikerjakan dengan teknik tradisional oleh pengrajin berpengalaman.",
    price: "Rp 350.000",
    image: "https://images.unsplash.com/photo-1672716912554-c23ba8fac4ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwYmF0aWslMjBmYWJyaWN8ZW58MXx8fHwxNzgyODAwNDc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Kerajinan",
    seller: "Bapak Hadi Purnomo",
    contact: "0813-2345-6789",
    lat: -7.4788, lng: 110.2185
  },
  {
    id: "3",
    name: "Tas Anyaman Pandan",
    description: "Tas cantik hasil anyaman pandan yang ramah lingkungan. Tersedia berbagai ukuran dan warna.",
    price: "Rp 75.000",
    image: "https://images.unsplash.com/photo-1527383214149-cb7be04ae387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwaGFuZGljcmFmdHMlMjBwcm9kdWN0c3xlbnwxfHx8fDE3ODI4MDA0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Kerajinan",
    seller: "Ibu Siti Aminah",
    contact: "0856-7890-1234",
    lat: -7.4795, lng: 110.2188
  },
  {
    id: "4",
    name: "Sambal Pecel Homemade",
    description: "Sambal pecel dengan resep turun temurun. Pedas, gurih, dan cocok untuk berbagai hidangan.",
    price: "Rp 20.000",
    image: "https://images.unsplash.com/photo-1539755530862-00f623c00f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwdHJhZGl0aW9uYWwlMjBmb29kfGVufDF8fHx8MTc4MjgwMDQ3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Makanan",
    seller: "Ibu Endang Susilowati",
    contact: "0857-1234-5678",
    lat: -7.4782, lng: 110.2172
  },
  {
    id: "5",
    name: "Sayuran Hidroponik Segar",
    description: "Sayuran segar hasil kebun hidroponik RW 18. Selada, kangkung, dan bayam tanpa pestisida.",
    price: "Rp 10.000",
    image: "https://images.unsplash.com/photo-1760009449712-09befce78964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjBlbnZpcm9ubWVudGFsfGVufDF8fHx8MTc4MjgwMDQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Pertanian",
    seller: "Kelompok Tani RW 18",
    contact: "0858-9012-3456",
    lat: -7.4783, lng: 110.2181
  },
  {
    id: "6",
    name: "Kue Kering Lebaran",
    description: "Aneka kue kering dengan berbagai varian rasa. Nastar, kastengel, putri salju, dan lainnya.",
    price: "Rp 50.000",
    image: "https://images.unsplash.com/photo-1539755530862-00f623c00f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwdHJhZGl0aW9uYWwlMjBmb29kfGVufDF8fHx8MTc4MjgwMDQ3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Makanan",
    seller: "Ibu Rina Wulandari",
    contact: "0859-3456-7890",
    lat: -7.4798, lng: 110.2180
  }
];

export const kesenianData: KesenianLocation[] = [
  {
    id: "k1",
    name: "Sanggar Seni Nambangan",
    description: "Pusat kegiatan seni dan budaya warga RW 18. Tempat belajar dan melestarikan seni tradisional Jawa — dari tari, karawitan, hingga seni rupa.",
    category: "Sanggar Seni",
    lat: -7.4785, lng: 110.2183,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    schedule: "Setiap Minggu, 08.00–12.00 WIB",
    activities: ["Tari tradisional Jawa", "Karawitan gamelan", "Pelatihan seni lukis", "Pentas seni rutin bulanan"],
    contact: "0811-2233-4455"
  },
  {
    id: "k2",
    name: "Panggung Terbuka Balai RW",
    description: "Panggung terbuka di halaman Balai RW 18 yang digunakan untuk pentas seni, pertunjukan budaya, dan acara komunitas.",
    category: "Ruang Pertunjukan",
    lat: -7.4793, lng: 110.2179,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    schedule: "Acara insidental & hari besar nasional",
    activities: ["Pentas wayang kulit", "Pertunjukan ketoprak", "Festival seni tahunan", "Lomba kreasi warga"],
    contact: "0812-3456-7890"
  },
  {
    id: "k3",
    name: "Perpustakaan Kampung Nambangan",
    description: "Perpustakaan komunitas yang menyediakan koleksi buku, majalah, dan akses literasi digital bagi seluruh warga RW 18.",
    category: "Literasi & Budaya",
    lat: -7.4800, lng: 110.2178,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    schedule: "Senin–Sabtu, 09.00–16.00 WIB",
    activities: ["Peminjaman buku gratis", "Kelas baca tulis anak", "Diskusi literasi warga", "Donasi buku komunitas"],
    contact: "0813-4567-8901"
  },
  {
    id: "k4",
    name: "Pojok Budaya & Galeri Warga",
    description: "Ruang pameran karya seni dan kerajinan warga RW 18 yang dipajang secara bergantian. Menampilkan batik, lukisan, dan kerajinan lokal.",
    category: "Galeri & Pameran",
    lat: -7.4787, lng: 110.2170,
    image: "https://images.unsplash.com/photo-1531913223931-b0d3198229ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    schedule: "Setiap hari, 08.00–17.00 WIB",
    activities: ["Pameran karya warga", "Workshop batik", "Penjualan karya seni", "Dokumentasi budaya lokal"],
    contact: "0814-5678-9012"
  }
];
