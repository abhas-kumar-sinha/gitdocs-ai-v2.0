import { Metadata } from "next";
import ProjectView from "@/components/project/ProjectView";
import { Suspense } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Gitdocs AI Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  let project;
  try {
    project = await caller.project.getById({ id: projectId });
  } catch {
    notFound();
  }

  if (!project) {
    notFound();
  }

  await queryClient.prefetchQuery(
    trpc.project.getById.queryOptions({
      id: projectId,
    })
  );

  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="Loading Project"
          subtitle="Please wait while we load your project"
        />
      }
    >
      <ProjectView projectId={projectId} />
    </Suspense>
  );
};

export default Page;
