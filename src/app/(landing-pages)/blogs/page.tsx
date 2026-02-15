import BlogPage from "@/app/pages/BlogsPage"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Blog – Gitdocs AI",
    template: "%s | Gitdocs AI",
  },

  description:
    "Guides, insights, and best practices on documentation, open-source, and developer productivity—written by the creator of Gitdocs AI.",

  keywords: [
    "developer blog",
    "documentation blog",
    "open source guides",
    "README best practices",
    "developer productivity",
    "AI documentation",
    "Gitdocs AI blog",
  ],

  authors: [
    {
      name: "Abhas Kumar Sinha",
      url: "https://github.com/abhas-kumar-sinha",
    },
  ],

  alternates: {
    canonical: "https://www.gitdocs.cloud/blogs",
    languages: {
      "en": "https://www.gitdocs.cloud/blogs",
      "x-default": "https://www.gitdocs.cloud/blogs",
    },
  },

  openGraph: {
    type: "website", // ✅ blog index is NOT an article
    title: "Gitdocs AI Blog",
    description:
      "Guides, insights, and best practices for documentation, open-source, and developer productivity.",
    url: "https://www.gitdocs.cloud/blogs",
    siteName: "Gitdocs AI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Gitdocs AI Blog",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    creator: "@AbhasKumar99",
    title: "Gitdocs AI Blog",
    description:
      "Guides, insights, and best practices for documentation and developer productivity.",
    images: ["/og.png"],
  },
};

const Page = () => {
  return (
    <BlogPage />
  )
}
export default Page