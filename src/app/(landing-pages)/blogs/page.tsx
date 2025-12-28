import BlogPage from "@/app/pages/BlogsPage"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog – Gitdocs AI",
  description:
    "Guides, insights, and best practices for documentation, open-source, and developer productivity.",
  alternates: {
    canonical: "https://www.gitdocs.space/blogs",
  },
};


const Page = () => {
  return (
    <BlogPage />
  )
}
export default Page