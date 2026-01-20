import { Metadata } from "next";
import LandingPage from "@/app/pages/LandingPage";
import DashboardPage from "@/app/pages/DashboardPage";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "Gitdocs AI – Generate & Improve README Files with AI",
    template: "%s | Gitdocs AI",
  },

  description:
    "Gitdocs AI helps developers generate, improve, and maintain professional README files directly from their GitHub repositories using AI.",

  keywords: [
    "README generator",
    "AI documentation",
    "GitHub README",
    "developer documentation",
    "AI developer tools",
    "GitHub tools",
    "README.md generator",
    "automated documentation",
  ],

  authors: [
    {
      name: "Abhas Kumar Sinha",
      url: "https://github.com/abhas-kumar-sinha",
    },
  ],

  alternates: {
    canonical: "https://www.gitdocs.space",
    languages: {
      "en": "https://www.gitdocs.space",
      "x-default": "https://www.gitdocs.space",
    },
  },

  openGraph: {
    type: "website",
    title: "Gitdocs AI – AI-Powered README Generator",
    description:
      "Generate production-ready README files with AI. Connect your GitHub repo and ship better documentation faster.",
    url: "https://www.gitdocs.space",
    siteName: "Gitdocs AI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Gitdocs AI – AI README Generator",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    creator: "@AbhasKumar99",
    title: "Gitdocs AI – Generate Better README Files with AI",
    description:
      "AI-powered README generator for GitHub repositories. Ship better docs, faster.",
    images: ["/og.png"],
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

            url: "https://www.gitdocs.space",
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
