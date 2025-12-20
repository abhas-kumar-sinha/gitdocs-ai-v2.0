import { Suspense } from 'react';
import { getQueryClient, trpc } from '@/trpc/server';
import ProjectView from '@/components/project/ProjectView'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import LoadingScreen from '@/components/common/LoadingScreen';

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const Page = async ({ params }: Props) => {
    const { projectId } = await params;

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.message.getMany.queryOptions({
        projectId
      }))
    void queryClient.prefetchQuery(trpc.project.getById.queryOptions({
        id: projectId
      }))

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingScreen title={"Loading Project"} subtitle={"Getting everything ready"} /> }>
          <ProjectView projectId={projectId} />
        </Suspense>
      </HydrationBoundary>
    )
};

export default Page;
