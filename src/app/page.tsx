import { Metadata } from "next";
import LandingPage from "@/app/pages/LandingPage";
import DashboardPage from "@/app/pages/DashboardPage";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Gitdocs AI – Generate & Improve README Files with AI",
  description:
    "Gitdocs AI helps developers generate, improve, and maintain professional README files directly from their GitHub repositories.",
  keywords: [
    "README generator",
    "AI documentation",
    "GitHub README",
    "developer documentation",
    "AI developer tools",
    "GitHub tools",
    "Gitdocs AI",
    "README.md generator",
  ],
  alternates: {
    canonical: "https://www.gitdocs.space",
  },
  openGraph: {
    title: "Gitdocs AI",
    description:
      "Generate production-ready README files using AI. Connect your GitHub repo and ship better docs.",
    url: "https://www.gitdocs.space",
    siteName: "Gitdocs AI",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
            url: "https://www.gitdocs.space",
            applicationCategory: "Developer Tools",
            operatingSystem: "Web",
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
