import GitHubInstallPage from "@/app/pages/GitHubInstallPage";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gitdocs AI Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


const Page = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <GitHubInstallPage />
    </Suspense>
  );
};
export default Page;
