import { adminLogout } from "./adminAuth";

const IS_SERVER = typeof window === "undefined";

export const getApiBaseUrl = (): string => {
  if (IS_SERVER) {
    return process.env.API_BASE_URL || "http://localhost:8080/api/v1";
  }
  return "/api/v1";
};

// Interfaces compatible with existing mockData definitions
export interface NewsItem {
  id: string;
  slug: string;
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
  kegiatan: string;
  images?: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  tags: string[];
}

// Fetch helper with JWT injecting
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});

  if (!IS_SERVER) {
    const token = localStorage.getItem("rw18_admin_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && !IS_SERVER) {
    adminLogout();
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/login";
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();
  return json;
}

// Mapping Functions to transform backend response schemas into UI compat-schemas
function mapNews(item: any): NewsItem {
  return {
    id: item.id,
    slug: item.slug || "",
    title: item.title,
    excerpt: item.excerpt || "",
    content: item.content || "",
    image: item.image_url || "https://images.unsplash.com/photo-1565583673900-1cd9320f6c8b",
    date: item.published_at ? item.published_at.split("T")[0] : item.created_at.split("T")[0],
    category: item.category_name || "Kegiatan",
    author: item.author_name || "Admin RW 18",
  };
}

function mapMapPoint(item: any) {
  const cat = item.category_slug || "";
  const base = {
    id: item.id,
    name: item.name,
    description: item.description || "",
    category: item.category_name || "",
    lat: Number(item.latitude),
    lng: Number(item.longitude),
    image: item.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
  };

  if (cat === "proklim") {
    return {
      ...base,
      locType: "proklim" as const,
      activities: item.subtitle ? item.subtitle.split(",").map((s: string) => s.trim()) : [],
    } as ProklimLocation & { locType: "proklim" };
  } else if (cat === "umkm") {
    const detail = item.umkm_detail || {};
    const rawPrice = detail.price;
    const formattedPrice = typeof rawPrice === "number" ? `Rp ${rawPrice.toLocaleString("id-ID")}` : "Rp 0";
    return {
      ...base,
      locType: "umkm" as const,
      price: formattedPrice,
      seller: detail.owner_name || "Penjual RW 18",
      contact: detail.contact_phone || "",
    } as UMKMProduct & { locType: "umkm" };
  } else {
    // kesenian
    return {
      ...base,
      locType: "kesenian" as const,
      schedule: item.subtitle || "Hubungi pengurus",
      activities: item.description ? [item.description] : [],
      contact: item.umkm_detail?.contact_phone || "",
    } as KesenianLocation & { locType: "kesenian" };
  }
}

function mapPodcast(item: any): PodcastEpisode {
  const hostName = item.guests && item.guests.length > 0 ? item.guests[0].name : "Host RW 18";
  const duration = item.duration_seconds ? `${Math.floor(item.duration_seconds / 60)} menit` : "30 menit";

  return {
    id: item.id,
    title: item.title,
    description: item.description || "",
    date: item.published_at ? item.published_at.split("T")[0] : item.created_at.split("T")[0],
    duration,
    host: hostName,
    category: item.category_name || "Proklim",
    platform: "youtube",
    embedId: item.youtube_video_id || "dQw4w9WgXcQ",
    thumbnail: item.youtube_video_id ? `https://img.youtube.com/vi/${item.youtube_video_id}/hqdefault.jpg` : "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
    tags: item.guests ? item.guests.map((g: any) => g.name) : [],
  };
}

function mapArchive(item: any): ArsipItem {
  const firstFile = item.files && item.files.length > 0 ? item.files[0] : null;
  const images = item.files ? item.files.filter((f: any) => f.file_type === "image" || f.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i)).map((f: any) => f.file_url) : [];

  let type: "foto" | "laporan" | "catatan" = "foto";
  if (item.doc_type === "pdf" || item.doc_type === "laporan") {
    type = "laporan";
  } else if (item.doc_type === "catatan") {
    type = "catatan";
  }

  let category = "Adaptasi";
  if (item.program_type) {
    category = item.program_type.charAt(0).toUpperCase() + item.program_type.slice(1).toLowerCase();
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description || "",
    date: item.activity_date ? item.activity_date.split("T")[0] : item.created_at.split("T")[0],
    category,
    type,
    kegiatan: item.title,
    images: images.length > 0 ? images : undefined,
    fileUrl: firstFile?.file_url || "#",
    fileName: firstFile?.file_name || "",
    fileSize: firstFile?.file_type || "Unknown size",
    tags: item.tags ? item.tags.map((t: any) => t.name) : [],
  };
}

// PUBLIC API
export const api = {
  // News
  async getNews(params: { category?: string; search?: string; page?: number; limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== "Semua") query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const res = await apiFetch<any>(`/news?${query.toString()}`);
    return {
      data: (res.data || []).map(mapNews),
      meta: res.meta || { page: 1, limit: 10, total_items: 0, total_pages: 1 }
    };
  },

  async getNewsCategories() {
    const res = await apiFetch<any>("/news-categories");
    return res.data || res; // backend returns success wrapper
  },

  async getNewsDetail(slug: string) {
    const res = await apiFetch<any>(`/news/${slug}`);
    return mapNews(res.data || res);
  },

  // Map Points
  async getMapPoints() {
    const res = await apiFetch<any>("/map-points");
    const raw = res.data || res;
    return raw.map(mapMapPoint);
  },

  async getMapCategories() {
    const res = await apiFetch<any>("/map-categories");
    return res.data || res;
  },

  // Podcast Episodes
  async getPodcasts() {
    const res = await apiFetch<any>("/podcast-episodes");
    const raw = res.data || res;
    return raw.map(mapPodcast);
  },

  async getPodcastCategories() {
    const res = await apiFetch<any>("/podcast-categories");
    return res.data || res;
  },

  // Archives
  async getArchives() {
    const res = await apiFetch<any>("/archive-documents");
    const raw = res.data || res;
    return raw.map(mapArchive);
  },

  async getOrganizationMembers() {
    const res = await apiFetch<any>("/organization-members");
    return res.data || res;
  },

  // ADMIN API (Requires JWT token automatically injected)
  admin: {
    async updateOrganizationMembers(data: { position: string; name: string }[]) {
      return apiFetch<any>("/admin/organization-members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },

    // News
    async getNews(params: { category?: string; status?: string; search?: string; page?: number; limit?: number } = {}) {
      const query = new URLSearchParams();
      if (params.category && params.category !== "Semua") query.set("category", params.category);
      if (params.status) query.set("status", params.status);
      if (params.search) query.set("search", params.search);
      if (params.page) query.set("page", params.page.toString());
      if (params.limit) query.set("limit", params.limit.toString());

      const res = await apiFetch<any>(`/admin/news?${query.toString()}`);
      return {
        data: (res.data || []).map(mapNews),
        meta: res.meta || { page: 1, limit: 10, total_items: 0, total_pages: 1 }
      };
    },

    async createNews(data: { title: string; slug: string; excerpt: string; content: string; image_url?: string; category_id?: string; status: string }) {
      const res = await apiFetch<any>("/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          published_at: data.status === "published" ? new Date().toISOString() : null,
        }),
      });
      return mapNews(res.data || res);
    },

    async updateNews(id: string, data: Partial<{ title: string; slug: string; excerpt: string; content: string; image_url?: string; category_id?: string; status: string }>) {
      const payload: any = { ...data };
      if (data.status === "published") {
        payload.published_at = new Date().toISOString();
      }
      const res = await apiFetch<any>(`/admin/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return mapNews(res.data || res);
    },

    async deleteNews(id: string) {
      await apiFetch<any>(`/admin/news/${id}`, { method: "DELETE" });
      return true;
    },

    // Map Points
    async getMapPoints() {
      const res = await apiFetch<any>("/admin/map-points");
      const raw = res.data || res;
      return raw.map(mapMapPoint);
    },

    async createMapPoint(data: { category_id: string; name: string; subtitle?: string; description?: string; latitude: number; longitude: number; address?: string; image_url?: string; is_active: boolean; price?: number; contact_phone?: string; owner_name?: string }) {
      const res = await apiFetch<any>("/admin/map-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: data.category_id,
          name: data.name,
          subtitle: data.subtitle,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          image_url: data.image_url,
          is_active: data.is_active,
          price: data.price,
          contact_phone: data.contact_phone,
          owner_name: data.owner_name,
        }),
      });
      return mapMapPoint(res.data || res);
    },

    async updateMapPoint(id: string, data: Partial<{ category_id: string; name: string; subtitle?: string; description?: string; latitude: number; longitude: number; address?: string; image_url?: string; is_active: boolean; price?: number; contact_phone?: string; owner_name?: string }>) {
      const res = await apiFetch<any>(`/admin/map-points/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return mapMapPoint(res.data || res);
    },

    async deleteMapPoint(id: string) {
      await apiFetch<any>(`/admin/map-points/${id}`, { method: "DELETE" });
      return true;
    },

    // Podcasts
    async createPodcast(data: { title: string; slug: string; description?: string; youtube_url: string; youtube_video_id?: string; category_id?: string; duration_seconds?: number; published_at?: string; is_featured: boolean }) {
      const res = await apiFetch<any>("/admin/podcast-episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return mapPodcast(res.data || res);
    },

    async updatePodcast(id: string, data: Partial<{ title: string; slug: string; description?: string; youtube_url: string; youtube_video_id?: string; category_id?: string; duration_seconds?: number; published_at?: string; is_featured: boolean }>) {
      const res = await apiFetch<any>(`/admin/podcast-episodes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return mapPodcast(res.data || res);
    },

    async deletePodcast(id: string) {
      await apiFetch<any>(`/admin/podcast-episodes/${id}`, { method: "DELETE" });
      return true;
    },

    // Archives
    async createArchive(data: { title: string; description?: string; doc_type: string; program_type?: string; activity_date?: string; files: any[] }) {
      const res = await apiFetch<any>("/admin/archive-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return mapArchive(res.data || res);
    },

    async updateArchive(id: string, data: Partial<{ title: string; description?: string; doc_type: string; program_type?: string; activity_date?: string; files: any[] }>) {
      const res = await apiFetch<any>(`/admin/archive-documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return mapArchive(res.data || res);
    },

    async deleteArchive(id: string) {
      await apiFetch<any>(`/admin/archive-documents/${id}`, { method: "DELETE" });
      return true;
    },
  }
};
