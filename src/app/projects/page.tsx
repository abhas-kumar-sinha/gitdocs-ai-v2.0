import ProjectBoard from "../pages/ProjectPage"; 
import Sidebar from "@/components/layout/Sidebar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = async () => {

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.project.list.queryOptions());

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="relative flex-1 overflow-y-scroll overflow-x-hidden bg-background">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProjectBoard />
        </HydrationBoundary>
      </div>
      
    </div>
  );
};

export default Page;