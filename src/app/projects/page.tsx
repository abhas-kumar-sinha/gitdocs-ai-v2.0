import { Metadata } from "next";
import ProjectPage from "../pages/ProjectPage";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Gitdocs AI Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const Page = async () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="relative flex-1 overflow-y-scroll overflow-x-hidden bg-background">
        <ProjectPage />
      </div>
    </div>
  );
};

export default Page;
