import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";

import CircleBackground from "@/components/animated-backgrounds/CircleBackground";
import LandingPage from "@/pages/LandingPage";
import LoadingScreen from "@/components/common/LoadingScreen";
import DashboardPage from "@/pages/DashboardPage";

const Home = () => {
  return (
    <>
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>

      <ClerkLoaded>
        <SignedOut>
          <CircleBackground source="landing" />
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
