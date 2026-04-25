import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastGlobal from "@/components/ToastGlobal";
import Providers from "@/app/providers";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Circuit Cartel | Custom Computer Parts Store",
  description: "Production-ready e-commerce platform for custom computer components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <Providers>
          <Navbar />
          <main className="container-shell flex-grow py-8 md:py-12">{children}</main>
          <Footer />
          <ToastGlobal />
        </Providers>
      </body>
    </html>
  );
}
