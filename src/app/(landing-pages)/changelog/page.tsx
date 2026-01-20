import ChangelogItems from "@/components/landing-page/changelog/changelogItems";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CircleCheckBig } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Changelog – Gitdocs AI",
    template: "%s | Gitdocs AI",
  },

  description:
    "Track new features, improvements, fixes, and updates to Gitdocs AI. Stay up to date with the latest changes from the creator.",

  keywords: [
    "Gitdocs AI changelog",
    "product updates",
    "feature updates",
    "release notes",
    "Gitdocs updates",
    "developer tool updates",
  ],

  authors: [
    {
      name: "Abhas Kumar Sinha",
      url: "https://github.com/abhas-kumar-sinha",
    },
  ],

  alternates: {
    canonical: "https://www.gitdocs.space/changelog",
    languages: {
      "en": "https://www.gitdocs.space/changelog",
      "x-default": "https://www.gitdocs.space/changelog",
    },
  },

  openGraph: {
    type: "website", // ✅ changelog is not an article
    title: "Gitdocs AI Changelog",
    description:
      "Track new features, improvements, and updates to Gitdocs AI.",
    url: "https://www.gitdocs.space/changelog",
    siteName: "Gitdocs AI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Gitdocs AI Changelog",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    creator: "@AbhasKumar99",
    title: "Gitdocs AI Changelog",
    description:
      "New features, improvements, and updates to Gitdocs AI.",
    images: ["/og.png"],
  },
};

export interface Changelog {
    type: "NEW" | "FEATURE" | "FIXES",
    title: string,
    content: string
}

const versionChange1: Changelog[] = [
  {
    type: "NEW",
    title: "Redesigned Dashboard",
    content: "The new dashboard brings a clearer overview of your projects, repositories, and recent activity, making it easier to jump back into documentation work and track progress at a glance."
  },
  {
    type: "NEW",
    title: "Streamlined GitHub Connection Workflow",
    content: "Connecting repositories is now faster and more reliable with a redesigned connection flow that reduces friction and gives clearer feedback during setup and sync."
  },
  {
    type: "NEW",
    title: "Advanced Permission Management",
    content: "Manage access with more control using improved permission handling, ensuring the right users have the right level of access across projects and repositories."
  },
  {
    type: "NEW",
    title: "AI Agent Workflow powered by Inngest",
    content: "Documentation workflows are now driven by a more robust AI agent system built on Inngest, enabling reliable background jobs, smarter task orchestration, and smoother long-running AI operations."
  },
  {
    type: "FEATURE",
    title: "Faster, More Responsive Editing Experience",
    content: "Under-the-hood performance improvements deliver quicker responses, smoother interactions, and a more stable editing experience across the platform."
  }
]

const versionChange2: Changelog[] = [
  {
    type: "NEW",
    title: "Voice-Powered Prompts",
    content:
      "You can now dictate prompts using voice input, making it faster and more natural to describe what you want to document. This is especially useful for brainstorming ideas or capturing context without breaking your flow."
  },
  {
    type: "NEW",
    title: "Image-Aware README Enhancement",
    content:
      "Gitdocs now understands images as part of your documentation context. Upload screenshots, diagrams, or banners and let the AI use them intelligently to enhance and structure your README content."
  },
  {
    type: "NEW",
    title: "Contextual Image Roles",
    content:
      "Images can now be tagged with roles such as banners, screenshots, diagrams, or logos, allowing Gitdocs to place them in the most appropriate sections of your README for clearer, more professional documentation."
  },
  {
    type: "FEATURE",
    title: "Improved Commit Infrastructure",
    content:
      "The commit pipeline has been upgraded to reliably handle richer documentation outputs, including images and enhanced markdown, ensuring smooth and consistent pushes to your repositories."
  },
  {
    type: "FEATURE",
    title: "Richer AI Context for Documentation",
    content:
      "Behind the scenes, Gitdocs now provides the AI with deeper contextual signals from prompts, images, and project structure, resulting in more accurate, relevant, and high-quality README generation."
  }
];


const LandingPage = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen mx-auto max-w-7xl flex flex-col items-center pt-40">
        <div className="xl:w-7/10 w-9/10 h-20 flex flex-col gap-y-4 lg:flex-row items-start justify-between">
          <h1 className="lg:w-1/2 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold xl:leading-[0.9]">
            Product evolution timeline and feature releases
          </h1>

          <p className="lg:w-2/5 text-foreground text-sm md:text-base">
            Explore detailed release notes covering new features, refinements, fixes, and performance enhancements. Stay in sync with what&apos;s new and what&apos;s coming.
          </p>
        </div>

        <div className="w-9/10 bg-sidebar min-h-screen mt-40 mb-20 flex flex-col rounded-3xl p-8 text-sidebar-foreground">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl">Gitdocs Release History</h2>
              <p className="text-sidebar-foreground/50">Complete release history with detailed change tracking</p>
            </div>
            <div className="flex items-center gap-x-2 text-xs py-1 px-2 rounded-md bg-primary/20 text-primary font-thin font-mono">
              <CircleCheckBig size={10} />
              2.2.0
            </div>
          </div>

          <hr className="mt-6 mb-10 border-border" />

          <div className="relative flex h-full w-full">
            <div className="absolute left-6 h-[calc(100%-1.5em)] w-px bg-border hidden md:block" />
            <div className="absolute left-[19.45px] top-2 h-2.5 w-2.5 rounded-full bg-primary hidden md:block" />
            
            <div className="md:ms-12">
              <div className="flex items-center gap-x-2 h-fit">
                <span className="text-accent-foreground font-mono">2.2.0</span>
                <span className="text-foreground/50 text-sm mt-1"> January 01, 2026 &nbsp; 00:00:00</span>
              </div>

              <div className="mt-4">
                <h3 className="text-xl text-accent-foreground font-semibold">
                  🚀 Platform Update: Voice, Images, and Smarter README Generation
                </h3>
                <p className="mt-2 text-sm md:text-base">
                  We’re excited to roll out Gitdocs AI v2.2.0, a feature-rich update that makes documentation creation more natural, contextual, and powerful.
                  This release introduces voice-powered prompts, image-aware README enhancement, and a more robust commit infrastructure—allowing you to capture ideas faster, provide richer context to the AI, and confidently push high-quality documentation to your repositories.
                  With these improvements, Gitdocs moves closer to a truly multimodal documentation workflow that adapts to how you build and ship software.
                </p>
              </div>

              <ChangelogItems items={versionChange2} />

              <div className="flex items-center gap-x-2 h-fit mt-16">
                <span className="text-accent-foreground font-mono">2.0.0</span>
                <span className="text-foreground/50 text-sm mt-1"> December 28, 2025</span>
              </div>

              <div className="mt-4">
                <h3 className="text-xl text-accent-foreground font-semibold">
                  🚀 Major Platform Update: Smarter Docs, Faster Workflow
                </h3>
                <p className="mt-2 text-sm md:text-base">We’re excited to introduce Gitdocs AI v2.0.0, a major milestone in our journey toward making documentation creation faster, smarter, and more intuitive.
                  This release marks a significant evolution of the platform, introducing a more refined workflow, deeper AI assistance, and new ways to explore, remix, and improve documentation—giving teams more control, clarity, and speed as they build and ship.</p>
              </div>

              <ChangelogItems items={versionChange1} />

            </div>
            
          </div>
          

          <hr className="my-6 border-border" />

          <div className="flex flex-col md:flex-row gap-y-6 item-center justify-between md:px-8 py-2">
            <div className="flex flex-col items-start">
              <span>Abhas Kumar Sinha</span>
              <span className="text-xs text-foreground">Creater of Gitdocs AI</span>
            </div>

            <div className="text-xs my-auto">
              <span>Last Updated: </span>
              <span> December 28, 2025</span>
            </div>
          </div>
        </div>
        
      </div>

      <Footer />
    </>
  );
};
export default LandingPage;
