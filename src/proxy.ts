import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/blogs(.*)",
  "/view-templates(.*)",
  "/changelog(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/api/inngest(.*)",
  "/api/webhooks/clerk(.*)",
  "/api/webhooks/github(.*)",
]);

const isMaintenanceAllowedRoute = createRouteMatcher([
  "/api/inngest(.*)",
  "/api/webhooks/github(.*)",
  "/api/webhooks/clerk(.*)",
]);

export default clerkMiddleware(async (auth, req) => {

  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // 🚧 MAINTENANCE MODE
  if (maintenanceMode && !isMaintenanceAllowedRoute(req)) {
    return new NextResponse(
      `
      <html>
        <head><title>Maintenance</title></head>
        <body style="
          display:flex;
          align-items:center;
          justify-content:center;
          height:100vh;
          font-family:system-ui;
          background:#0b0b0b;
          color:#fff;
        ">
          <div style="text-align:center">
            <h1>Maintenance</h1>
            <p>We're upgrading Gitdocs AI.<br/>We'll be back shortly.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 503,
        headers: {
          "Content-Type": "text/html",
          "Retry-After": "300",
        },
      }
    );
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
