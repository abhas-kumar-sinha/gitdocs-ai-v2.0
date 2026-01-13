import { Metadata } from "next";
import ProjectView from "@/components/project/ProjectView";
import { Suspense } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";

export const metadata: Metadata = {
  title: "Gitdocs AI Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;

  return (
    <Suspense fallback={<LoadingScreen title="Loading Project" subtitle="Please wait while we load your project" />}>
      <ProjectView projectId={projectId} />
    </Suspense>
  );
};

export default Page;
