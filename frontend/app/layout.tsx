import type { Metadata } from "next";
import LayoutWrapper from "./LayoutWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "RW 18 Nambangan",
  description: "Website komunitas RW 18 Nambangan, Kelurahan Rejowinangun Utara, Kota Magelang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
