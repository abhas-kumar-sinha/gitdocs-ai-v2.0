import { cache } from "react";
import { prisma } from "@/lib/db";
import superjson from "superjson";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";

export const createTRPCContext = cache(async () => {
  return {
    auth: await auth(),
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const isAuthorized = t.middleware(async ({ next, ctx }) => {
  const clerkId = ctx?.auth?.userId;

  if (!clerkId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  let user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, clerkId: true },
  });

  if (!user) {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(clerkId);

    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

    if (!email) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No email found for Clerk user",
      });
    }

    user = await prisma.user.create({
      data: {
        clerkId,
        email,
      },
      select: { id: true, clerkId: true },
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...ctx.auth,
        clerkId,
        userId: user.id,
      },
    },
  });
});


// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthorized);
