"use client"

import { useEffect } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import { redirect } from "next/navigation";

const Onboarding = () => {

    useEffect(() => {
        const interval = setInterval(() => {
            redirect("/")
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <LoadingScreen />
    )
}
export default Onboarding