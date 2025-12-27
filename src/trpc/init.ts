import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
  return { 
    auth: await auth()
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const isAuthorized = t.middleware(async ({ next, ctx }) => {
  const clerkId = ctx?.auth?.userId;
  if (!clerkId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, clerkId: true },
  });

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
  }

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...ctx.auth,
        clerkId,        // original Clerk id
        userId: user.id // your internal user id
      },
    },
  });
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthorized);
