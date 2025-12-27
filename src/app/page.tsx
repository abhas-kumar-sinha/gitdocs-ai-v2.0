import { Metadata } from "next";
import LandingPage from "@/app/pages/LandingPage";
import DashboardPage from "@/app/pages/DashboardPage";
import LoadingScreen from "@/components/common/LoadingScreen";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
import BgMain from "@/components/animated-backgrounds/bgMain";

export const metadata: Metadata = {
  title: "Gitdocs AI",
  description: "",
};

const Home = () => {
  return (
    <>
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>

      <ClerkLoaded>
        <SignedOut>
          <BgMain />
          <LandingPage />
        </SignedOut>

        <SignedIn>
          <DashboardPage />
        </SignedIn>
      </ClerkLoaded>
    </>
  );
};

export default Home;
