import { caller } from "@/trpc/server";
import Sidebar from "@/components/layout/Sidebar";
import ProjectBoard from "../pages/ProjectPage"; 

const Page = async () => {

  const projects = await caller.project.list();

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="relative flex-1 overflow-y-scroll overflow-x-hidden bg-background">
        <ProjectBoard initialProjects={projects} />
      </div>
    </div>
  );
};

export default Page;