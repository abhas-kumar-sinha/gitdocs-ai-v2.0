import { createTRPCRouter } from '../init';
import { userRouter } from '@/modules/user/server/procedures';
import { projectRouter } from '@/modules/projects/server/procedures';
import { messagesRouter } from '@/modules/messages/server/procedures';
import { installationRouter } from '@/modules/installation/server/procedures';
import { installationProcessRouter } from '@/modules/installation-process/server/procedures';

export const appRouter = createTRPCRouter({
  user: userRouter,
  installation: installationRouter,
  installationProcess: installationProcessRouter,
  messages: messagesRouter,
  project: projectRouter
});

export type AppRouter = typeof appRouter;