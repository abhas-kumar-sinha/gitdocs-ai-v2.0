import LocalProjectList from "@/components/editor/LocalDocumentList";
import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";
import CreateProject from "@/components/editor/CreateProject";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Sidebar from "@/components/layout/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default:
      "Gitdocs Editor – Online Markdown Editor with Live Preview, Autosave & Local Storage",
    template: "%s | Gitdocs Editor",
  },

  description:
    "Gitdocs Editor is a modern online markdown editor with live preview, offline support, local autosave, project workspaces, and extensible plugins. A powerful alternative to StackEdit, Dillinger, live markdown preview tools, and README.so.",

  keywords: [
    // Core
    "markdown editor",
    "online markdown editor",
    "markdown editor online",
    "live markdown editor",
    "markdown live preview",
    "markdown preview editor",

    // Competitive
    "stackedit alternative",
    "dillinger alternative",
    "readme.so alternative",
    "live preview markdown editor",
    "best markdown editor",
    "modern markdown editor",

    // Feature based
    "offline markdown editor",
    "local markdown editor",
    "markdown editor without login",
    "privacy focused markdown editor",
    "local storage markdown editor",
    "markdown editor with autosave",
    "markdown editor with projects",
    "markdown editor with plugins",
    "markdown workspace",
    "markdown studio",

    // Developer focus
    "markdown editor for developers",
    "markdown editor for github",
    "readme editor",
    "github readme editor",
    "developer documentation editor",
    "documentation editor",
    "docs editor",
  ],

  alternates: {
    canonical: "https://www.gitdocs.cloud/editor",
    languages: {
      "en": "https://www.gitdocs.cloud/editor",
      "x-default": "https://www.gitdocs.cloud/editor",
    },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    title:
      "Gitdocs Editor – Online Markdown Editor with Live Preview & Local Save",
    description:
      "Write, preview, save, and manage markdown locally with a fast, offline-first markdown editor. Built as a modern alternative to StackEdit, Dillinger, and README.so.",
    url: "https://www.gitdocs.cloud/editor",
    siteName: "Gitdocs Editor",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Gitdocs Editor – Modern Markdown Editor with Live Preview",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    creator: "@AbhasKumar99",
    title:
      "Gitdocs Editor – Online Markdown Editor with Live Preview & Local Save",
    description:
      "A powerful offline-first markdown editor with live preview, autosave, projects, and plugins. The modern alternative to StackEdit, Dillinger, and README.so.",
    images: ["/og.png"],
  },

  category: "developer tools",

  other: {
    "application-name": "Gitdocs Editor",
    "apple-mobile-web-app-title": "Gitdocs Editor",
  },
};

const page = async () => {

  const { userId } = await auth();

  return (
    <div className="relative flex">
      <SignedIn>
        <Sidebar />
      </SignedIn>
      <SignedOut>
        <Navbar />
      </SignedOut>
      <div className={cn("flex flex-col justify-center items-center flex-1", !userId && "mt-24")}>
        <div className="max-w-md w-full p-4">
          <h1 className="md:text-3xl text-2xl font-bold">Markdown Editor</h1>
          <CreateProject />
          <LocalProjectList />
        </div>
      </div>
    </div>
  )
}

export default page;