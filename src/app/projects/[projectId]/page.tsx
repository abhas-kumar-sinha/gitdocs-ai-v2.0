import { Suspense } from 'react';
import { getQueryClient, trpc } from '@/trpc/server';
import ProjectView from '@/components/project/ProjectView'
import LoadingScreen from '@/components/common/LoadingScreen';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(trpc.message.getMany.queryOptions({
        projectId
      }))
    await queryClient.prefetchQuery(trpc.project.getById.queryOptions({
        id: projectId
      }))
  } catch (error) {
    console.error('Failed to prefetch projects:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingScreen title={"Loading Project"} subtitle={"Getting everything ready"} /> }>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  )
};

export default Page;
