import { createBrowserRouter, Navigate } from "react-router";
import Root from "./components/Root";
import Home from "./pages/Home";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Peta from "./pages/Peta";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Podcast from "./pages/Podcast";
import Arsip from "./pages/Arsip";
import NotFound from "./pages/NotFound";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBerita from "./pages/admin/AdminBerita";
import AdminArsip from "./pages/admin/AdminArsip";
import AdminPeta from "./pages/admin/AdminPeta";
import AdminPodcast from "./pages/admin/AdminPodcast";
import AdminInformasi from "./pages/admin/AdminInformasi";

export const router = createBrowserRouter([
  // ── Public site ─────────────────────────────────
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,         Component: Home },
      { path: "news",        Component: News },
      { path: "news/:id",    Component: NewsDetail },
      { path: "peta",        Component: Peta },
      { path: "umkm/:id",    Component: ProductDetail },
      { path: "podcast",     Component: Podcast },
      { path: "arsip",       Component: Arsip },
      { path: "about",       Component: About },
      { path: "*",           Component: NotFound },
    ],
  },

  // ── Admin ────────────────────────────────────────
  { path: "/admin",          element: <Navigate to="/admin/login" replace /> },
  { path: "/admin/login",    Component: AdminLogin },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { path: "dashboard",   Component: AdminDashboard },
      { path: "berita",      Component: AdminBerita },
      { path: "arsip",       Component: AdminArsip },
      { path: "peta",        Component: AdminPeta },
      { path: "podcast",     Component: AdminPodcast },
      { path: "informasi",   Component: AdminInformasi },
    ],
  },
]);
