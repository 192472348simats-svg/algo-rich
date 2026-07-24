import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ui/Toast";
import { PostHogProvider } from "./components/PostHogProvider";
import { SessionProvider } from "next-auth/react";
import TimezoneSync from "./components/TimezoneSync";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://algo-rich.com'),
  title: {
    default: "Algo Rich - Master Python & DSA",
    template: "%s | Algo Rich"
  },
  description: "Master Python and Data Structures through structured, systematic learning. Stop random problem-solving, start strategic skill-building.",
  keywords: ["DSA", "Python", "Data Structures", "Algorithms", "Interview Prep", "Coding Challenge"],
  openGraph: {
    title: "Algo Rich - Master Python & DSA",
    description: "Structured, systematic learning for Data Structures and Algorithms.",
    url: "https://algo-rich.com",
    siteName: "Algo Rich",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algo Rich - Master Python & DSA",
    description: "Strategic skill-building for engineering interviews.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <SessionProvider>
          <TimezoneSync />
          <PostHogProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </PostHogProvider>
        </SessionProvider>
        {/* Register Pyodide service worker for CDN caching — second visit loads Python runtime instantly */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
