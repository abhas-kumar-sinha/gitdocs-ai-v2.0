import { Metadata } from "next";
import LandingPage from "@/app/pages/LandingPage";
import DashboardPage from "@/app/pages/DashboardPage";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default:
      "Gitdocs AI – AI GitHub README Generator & Developer Documentation Platform",
    template: "%s | Gitdocs AI",
  },

  description:
    "Gitdocs AI is an AI-powered README generator and developer documentation platform that helps teams generate, improve, and maintain high-quality GitHub README.md files and technical documentation directly from repositories.",

  keywords: [
    // Core intent
    "gitdocs ai",
    "readme generator",
    "ai readme generator",
    "github readme generator",
    "ai documentation generator",
    "developer documentation platform",

    // GitHub intent
    "github documentation",
    "github readme",
    "github tools",
    "github ai tools",
    "github automation",
    "github developer tools",

    // AI + docs
    "ai documentation",
    "ai developer tools",
    "ai docs generator",
    "automated documentation",
    "documentation automation",
    "ai technical writing",

    // Product intent
    "developer tools",
    "documentation tools",
    "software documentation",
    "technical documentation",
    "documentation platform",
    "docs platform",
    "engineering documentation",

    // README specific
    "readme.md generator",
    "readme builder",
    "readme creator",
    "github readme builder",
    "project documentation",
    "open source documentation",

    // Long-tail
    "ai tools for developers",
    "ai tools for github",
    "ai tools for open source",
    "documentation for developers",
    "developer productivity tools",
    "engineering productivity tools",
  ],

  authors: [
    {
      name: "Abhas Kumar Sinha",
      url: "https://github.com/abhas-kumar-sinha",
    },
  ],

  alternates: {
    canonical: "https://www.gitdocs.cloud",
    languages: {
      "en": "https://www.gitdocs.cloud",
      "x-default": "https://www.gitdocs.cloud",
    },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    title:
      "Gitdocs AI – AI README Generator & Developer Documentation Platform",
    description:
      "Generate production-ready README.md files and developer documentation using AI. Gitdocs AI connects to GitHub repositories and automates professional documentation workflows.",
    url: "https://www.gitdocs.cloud",
    siteName: "Gitdocs AI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Gitdocs AI – AI README Generator for GitHub",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    creator: "@AbhasKumar99",
    title:
      "Gitdocs AI – AI README Generator & Developer Documentation Platform",
    description:
      "AI-powered README and documentation generator for GitHub repositories. Automate professional docs for developers and teams.",
    images: ["/og.png"],
  },

  category: "developer tools",

  other: {
    "application-name": "Gitdocs AI",
    "google-site-verification": "YOUR_VERIFICATION_CODE",
    "msvalidate.01": "YOUR_BING_CODE",
    "apple-mobile-web-app-title": "Gitdocs AI",
  },
};

const Home = () => {
  return (
    <>
      {/* Structured Data (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",

            name: "Gitdocs AI",
            description:
              "Gitdocs AI is an AI-powered developer tool that generates, improves, and maintains professional README files directly from GitHub repositories.",

            url: "https://www.gitdocs.cloud",
            operatingSystem: "Web",
            applicationCategory: "DeveloperApplication",

            datePublished: "2024-11-01",
            dateModified: "2026-01-20",

            author: {
              "@type": "Person",
              name: "Abhas Kumar Sinha",
              url: "https://github.com/abhas-kumar-sinha",
            },

            publisher: {
              "@type": "Person",
              name: "Abhas Kumar Sinha",
              url: "https://github.com/abhas-kumar-sinha",
            },

            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <DashboardPage />
      </SignedIn>
      
    </>
  );
};

export default Home;
