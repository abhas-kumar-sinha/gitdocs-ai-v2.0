"use client";

import { useEffect } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started – Gitdocs AI",
  description:
    "Set up Gitdocs AI and connect your GitHub repository in minutes.",
  robots: {
    index: false,
    follow: false,
  },
};


const Onboarding = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      redirect("/");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return <LoadingScreen />;
};
export default Onboarding;
