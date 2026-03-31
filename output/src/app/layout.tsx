import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Intel® Core™ Ultra | The Future of AI Performance",
  description: "Experience the ultimate AI PC with Intel® Core™ Ultra processors. Featuring integrated NPU for high-efficiency AI acceleration.",
  keywords: ["Intel", "Core Ultra", "AI PC", "Processor", "NPU", "Performance"],
  authors: [{ name: "Intel Engineering" }],
};

import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-black text-white`}
      >
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}


