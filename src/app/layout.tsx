import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://threadforge.app"),
  title: {
    default: "ThreadForge",
    template: "%s | ThreadForge"
  },
  description: "Premium Threads content intelligence platform for research, ideation, writing, adaptation, and scheduling.",
  openGraph: {
    title: "ThreadForge",
    description: "Threads intelligence platform for premium creator teams.",
    type: "website",
    url: "https://threadforge.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "ThreadForge",
    description: "Premium Threads intelligence platform"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
