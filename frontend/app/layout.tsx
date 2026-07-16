import type { Metadata } from "next";
import LayoutWrapper from "./LayoutWrapper";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans', preload: false});

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
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
