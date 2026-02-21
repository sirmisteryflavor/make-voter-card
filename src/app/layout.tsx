import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PotatoVotes — Create & Share Your Voter Card",
  description:
    "Build a beautiful voter guide card for Instagram Stories, TikTok, and Twitter in seconds. Free, private, no sign-up required.",
  openGraph: {
    title: "PotatoVotes — Create & Share Your Voter Card",
    description:
      "Build a beautiful voter guide card for social media in seconds.",
    type: "website",
    url: "https://potatovotes.com",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PotatoVotes - Create and share your voter card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PotatoVotes — Create & Share Your Voter Card",
    description: "Build a beautiful voter guide card for social media in seconds.",
    images: ["/og-image.svg"],
  },
  keywords: [
    "voter guide",
    "election card",
    "social media",
    "voting",
    "ballot",
    "civic engagement",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
