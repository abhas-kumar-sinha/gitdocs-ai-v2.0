import ProjectPage from "../pages/ProjectPage";
import Sidebar from "@/components/layout/Sidebar";

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