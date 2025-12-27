import ProjectView from "@/components/project/ProjectView";

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
