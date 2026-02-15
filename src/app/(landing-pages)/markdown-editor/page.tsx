import BgMain from "@/components/animated-backgrounds/bgMain";
import Navbar from "@/components/layout/Navbar";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default:
      "Gitdocs Markdown Editor – Modern Markdown Editor with Live Preview, Local Save & Plugins",
    template: "%s | Gitdocs Markdown Editor",
  },

  description:
    "A powerful online markdown editor with live preview, local autosave, offline support, project workspaces, and extensible plugins. A modern alternative to StackEdit, Dillinger, Live Preview editors, and README.so.",

  keywords: [
    // Primary
    "markdown editor",
    "online markdown editor",
    "markdown editor online",
    "markdown live preview",
    "live markdown editor",
    "markdown preview editor",
    "markdown editor with preview",

    // Competitive
    "stackedit alternative",
    "dillinger alternative",
    "readme.so alternative",
    "live preview markdown editor",
    "best markdown editor",
    "modern markdown editor",

    // Feature-based
    "offline markdown editor",
    "local markdown editor",
    "markdown editor without login",
    "privacy focused markdown editor",
    "local storage markdown editor",
    "markdown editor with autosave",
    "markdown editor with projects",
    "markdown editor with plugins",
    "markdown workspace",

    // Dev-focused
    "markdown editor for developers",
    "markdown editor for github",
    "readme editor",
    "github readme editor",
    "developer documentation editor",
    "documentation editor",
    "docs editor",
  ],

  authors: [
    {
      name: "Abhas Kumar Sinha",
      url: "https://github.com/abhas-kumar-sinha",
    },
  ],

  alternates: {
    canonical: "https://www.gitdocs.cloud/markdown-editor",
    languages: {
      "en": "https://www.gitdocs.cloud/markdown-editor",
      "x-default": "https://www.gitdocs.cloud/markdown-editor",
    },
  },

  openGraph: {
    type: "website",
    title:
      "Gitdocs Markdown Editor – Modern Markdown Editor with Live Preview & Local Save",
    description:
      "Write, preview, save, and manage markdown locally with a fast, offline-first markdown editor. Built as a modern alternative to StackEdit, Dillinger, and README.so.",
    url: "https://www.gitdocs.cloud/markdown-editor",
    siteName: "Gitdocs Markdown Editor",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Gitdocs Markdown Editor – Modern Markdown Editor with Live Preview",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    creator: "@AbhasKumar99",
    title:
      "Gitdocs Markdown Editor – Modern Markdown Editor with Live Preview & Local Save",
    description:
      "A powerful offline-first markdown editor with live preview, autosave, projects, and plugins. The modern alternative to StackEdit, Dillinger, and README.so.",
    images: ["/og.png"],
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

  category: "developer tools",
};

const Page = () => {
  return (
    <div>
      <Navbar />
      <BgMain bgNumber={1} />

      <div className="mt-20">
        <Link href="/editor">
          Go To Editor
        </Link>
      </div>
    </div>
  );
};

export default Page;
