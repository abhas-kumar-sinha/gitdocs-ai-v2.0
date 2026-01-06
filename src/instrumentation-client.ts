import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});


export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
