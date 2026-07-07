import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RW 18 Nambangan - Kelurahan Rejowinangun Utara",
  description: "Website resmi komunitas RW 18 Nambangan, Kota Magelang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
