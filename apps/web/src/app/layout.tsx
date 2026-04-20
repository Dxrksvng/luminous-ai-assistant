import type { Metadata } from "next";
import { Inter, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LuminasPopup } from "@/components/luminas-popup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luminous - Personal AI Assistant",
  description: "Your personal AI assistant with Voice Interface - Thai/English Support",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Luminous",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Register service worker for PWA
  if (typeof window !== "undefined") {
    window.addEventListener("load", () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
          console.error("Service worker registration failed:", error);
        });
      }
    });
  }

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Luminous" />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <LuminasPopup />
        </ThemeProvider>
      </body>
    </html>
  );
}
