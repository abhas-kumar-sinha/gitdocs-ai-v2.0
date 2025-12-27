import AI_Prompt from "@/components/kokonutui/ai-prompt"
import BentoGrid from "@/components/kokonutui/bento-grid"
import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import { ChevronRight, Heart } from "lucide-react"

const LandingPage = () => {
  return (
    <>
        <Navbar />
        <div className="h-screen max-h-[768px] flex items-center justify-center mt-14 md:mt-10">
            <div className="flex flex-col gap-y-4 md:gap-y-6 w-full">
                <span className="mx-auto text-sm text-foreground/70 border border-foreground/10 ps-4 pe-3 py-1 rounded-full bg-background/90 flex items-center gap-x-2 cursor-pointer group transition-colors duration-300 hover:scale-102 animate-all hover:text-foreground hover:border-foreground/30">
                    <Heart size={13} />

                    <span>Introducing GitDocs AI v2.0</span>

                    <ChevronRight
                        className="
                        opacity-0
                        size-0
                        translate-x-[-4px]
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        group-hover:size-3.5
                        group-hover:translate-x-0
                        "
                    />
                </span>

                <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mt-2 max-w-9/10 mx-auto">
                    Make your repository explain itself
                </h2>
                <p className="text-foreground/70 text-xs md:text-base text-center max-w-2/3 mx-auto">Generate clean, structured README files directly from your GitHub repository using AI.</p>
                <div className="mx-auto relative w-9/10 max-w-2xl mt-3">
                    
                    <div className="py-4">
                        <div className="rounded-2xl bg-black/5 p-1.5 dark:bg-white/5">
                        <AI_Prompt isActive={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="lg:px-14 flex flex-col gap-y-4">
            <h3 className="text-2xl md:text-3xl lg:text-4xl text-center">Built for the modern stack</h3>
            <p className="text-center text-foreground/70 text-xs md:text-base max-w-2/3 mx-auto">Everything you need to maintain comprehensive documentation without leaving your terminal.</p>
            <BentoGrid />
        </div>
        <Footer />
    </>
  )
}
export default LandingPage