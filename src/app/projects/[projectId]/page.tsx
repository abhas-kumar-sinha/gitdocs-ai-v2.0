import ProjectView from "@/components/project/ProjectView";
import { Metadata } from "next";

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

  return <ProjectView projectId={projectId} />;
};

export default Page;
