import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound({backHref = "/"} : {backHref?: string}) {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">

      <div className="z-10 flex flex-col items-center gap-y-6 px-4 text-center">
        <h1 className="font-handwriting text-8xl font-bold text-accent-foreground md:text-9xl">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-accent-foreground/70 md:text-3xl">
            Page not found
          </h2>
          <p className="mx-auto max-w-md text-base text-muted-foreground md:text-lg">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Button asChild size="lg" className="mt-4">
          <Link href={backHref}>
            Go back home
          </Link>
        </Button>
      </div>
    </div>
  );
}