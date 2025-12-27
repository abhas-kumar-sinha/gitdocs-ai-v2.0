import GitHubInstallPage from "@/app/pages/GitHubInstallPage";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <GitHubInstallPage />
    </Suspense>
  );
};
export default Page;
