import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karrera — Resumes That Compile | Verified Career Credentials",
  description: "Turn self-reported resumes into cryptographically signed proof of who you are. Patent-pending verification technology.",
  openGraph: {
    title: "Karrera — Resumes That Compile",
    description: "Turn self-reported resumes into cryptographically signed proof of who you are. $1 to get your first verified career assessment.",
    type: "website",
    url: "https://karrera.io/",
    images: [{ url: "https://karrera.io/og-image.png", width: 1200, height: 630 }],
    siteName: "Karrera",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karrera — Resumes That Compile",
    description: "Turn self-reported resumes into cryptographically signed proof of who you are.",
    images: ["https://karrera.io/twitter-card.png"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230d9488'/><path d='M10 8v16M10 16l8-8M10 16l8 8' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/><circle cx='24' cy='8' r='2.5' fill='%2334d399'/></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@300,400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script async src="https://plausible.io/js/pa-nV0LEDjkN9GyEvFefCqCQ.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
