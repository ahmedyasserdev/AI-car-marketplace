// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Optionally enable Arcjet if needed
// import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";

// Arcjet middleware setup (disabled for now)
// const aj = arcjet({
//   key: process.env.ARCJET_KEY,
//   rules: [
//     shield({ mode: "LIVE" }),
//     detectBot({
//       mode: "LIVE",
//       allow: ["CATEGORY:SEARCH_ENGINE"],
//     }),
//   ],
// });

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/saved-cars(.*)",
  "/reservations(.*)",
]);

// Clerk middleware logic
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

// Default export: use Clerk only (or chain with Arcjet below)
export default clerk;

// To use Arcjet + Clerk together, uncomment below:
// export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    // Avoid Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always include API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};
