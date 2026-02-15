"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, type Variants } from "motion/react";
import { ArrowUpRight, CheckCircle2, Github, FileText, Sparkles, Zap, MessageSquare } from "lucide-react";

interface BentoItem {
  id: string;
  title: string;
  description: string;
  icons?: boolean;
  href?: string;
  feature?:
    | "chart"
    | "counter"
    | "code"
    | "timeline"
    | "spotlight"
    | "icons"
    | "typing"
    | "metrics";
  spotlightItems?: string[];
  timeline?: Array<{ year: string; event: string }>;
  code?: string;
  codeLang?: string;
  typingText?: string;
  metrics?: Array<{
    label: string;
    value: number;
    suffix?: string;
    color?: string;
  }>;
  statistic?: {
    value: string;
    label: string;
    start?: number;
    end?: number;
    suffix?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const bentoItems: BentoItem[] = [
  {
    id: "main",
    title: "AI-Powered README Generation",
    description:
      "Connect your GitHub repository and let AI create professional, comprehensive README files tailored to your project's needs.",
    href: "#",
    feature: "spotlight",
    spotlightItems: [
      "Automatic repository analysis",
      "Multiple professional templates",
      "Smart AI model selection",
      "Interactive chat enhancement",
      "Real-time preview",
    ],
    size: "lg",
    className: "col-span-2 row-span-1 md:col-span-1 md:row-span-1",
  },
  {
    id: "stat1",
    title: "README Generation in Action",
    description:
      "Watch as GitDocs AI analyzes your repository and generates comprehensive documentation",
    href: "#",
    feature: "typing",
    typingText:
      "# My Awesome Project\n\n## Overview\nA modern web application built with React and TypeScript...\n\n## Features\n- 🚀 Fast and responsive UI\n- 🎨 Beautiful design system\n- 🔒 Secure authentication\n- 📱 Mobile-first approach\n\n## Installation\n```bash\nnpm install\nnpm run dev\n```",
    size: "md",
    className: "col-span-2 row-span-1 col-start-1 col-end-3",
  },
  {
    id: "partners",
    title: "Smart AI Integration",
    description:
      "GitDocs AI automatically selects the best AI model for your project type and documentation needs",
    icons: true,
    href: "#",
    feature: "icons",
    size: "md",
    className: "col-span-1 row-span-1",
  },
  {
    id: "innovation",
    title: "Template Evolution",
    description:
      "From basic docs to comprehensive guides, our templates have evolved to cover every project type",
    href: "#",
    feature: "timeline",
    timeline: [
      { year: "Basic", event: "Simple README with essentials" },
      { year: "Standard", event: "Installation & usage guides" },
      { year: "Advanced", event: "API docs & architecture diagrams" },
      { year: "Premium", event: "Full documentation suite" },
      {
        year: "Custom",
        event: "AI-tailored for your exact needs",
      },
    ],
    size: "sm",
    className: "col-span-1 row-span-1",
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const SpotlightFeature = ({ items }: { items: string[] }) => {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item, index) => (
        <motion.li
          key={`spotlight-${item.toLowerCase().replace(/\s+/g, "-")}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {item}
          </span>
        </motion.li>
      ))}
    </ul>
  );
};

const IconsFeature = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Github className="w-7 h-7 transition-transform" />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          GitHub
        </span>
      </motion.div>

      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Sparkles className="w-7 h-7 transition-transform" />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          Smart AI
        </span>
      </motion.div>

      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <FileText className="w-7 h-7 transition-transform" />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          Templates
        </span>
      </motion.div>

      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <MessageSquare className="w-7 h-7 transition-transform" />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          Chat AI
        </span>
      </motion.div>

      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Zap className="w-7 h-7 transition-transform" />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          Instant
        </span>
      </motion.div>

      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          More
        </span>
      </motion.div>
    </div>
  );
};

const TimelineFeature = ({
  timeline,
}: {
  timeline: Array<{ year: string; event: string }>;
}) => {
  return (
    <div className="mt-3 relative">
      <div className="absolute top-0 bottom-0 left-[9px] w-[2px] bg-neutral-200 dark:bg-neutral-700" />
      {timeline.map((item, index) => (
        <motion.div
          key={`timeline-${item.year}-${item.event.toLowerCase().replace(/\s+/g, "-")}`}
          className="flex gap-3 mb-3 relative"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.15 * index,
          }}
        >
          <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 shrink-0 z-10 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {item.year}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {item.event}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TypingCodeFeature = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);

          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        },
        Math.random() * 30 + 10,
      );
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className="mt-3 relative">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          README.md
        </div>
      </div>
      <div
        ref={terminalRef}
        className="bg-neutral-900 dark:bg-black text-neutral-100 p-3 rounded-md text-xs font-mono h-[150px] overflow-y-auto"
      >
        <pre className="whitespace-pre-wrap">
          {displayedText}
          <span className="animate-pulse">|</span>
        </pre>
      </div>
    </div>
  );
};

function InteractiveChatDemo() {
  const [messages, setMessages] = useState([
    { type: "ai", text: "README generated! How can I enhance it?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isDemo) return;

    const timeoutIds: NodeJS.Timeout[] = [];
    
    const runAnimation = () => {
      setMessages([{ type: "ai", text: "README generated! How can I enhance it?" }]);
      
      timeoutIds.push(setTimeout(() => {
        setMessages(prev => [...prev, { type: "user", text: "Add installation steps" }]);
        
        timeoutIds.push(setTimeout(() => {
          setIsTyping(true);
          
          timeoutIds.push(setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: "ai", text: "Installation section added with npm commands!" }]);
            
            timeoutIds.push(setTimeout(() => {
              runAnimation();
            }, 3000));
          }, 1500));
        }, 1000));
      }, 2000));
    };

    const initialTimeout = setTimeout(runAnimation, 500);
    timeoutIds.push(initialTimeout);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [isDemo]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isDemo) return;

    setMessages(prev => [...prev, { type: "user", text: inputValue }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Added! I've enhanced the README with your suggestions.",
        "Done! The section has been updated.",
        "Great idea! I've incorporated that into your README.",
        "Updated! Check out the new changes.",
      ];
      setMessages(prev => [...prev, { 
        type: "ai", 
        text: responses[Math.floor(Math.random() * responses.length)] 
      }]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isDemo) {
      handleSendMessage();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isDemo && e.target === e.currentTarget) {
      setIsDemo(false);
      setMessages([{ type: "ai", text: "README generated! How can I enhance it?" }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-3">
        <div 
          ref={chatContainerRef}
          className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 h-[110px] overflow-y-auto space-y-2 scroll-smooth"
          onClick={handleContainerClick}
          style={{ scrollbarWidth: 'thin' }}
        >
          {messages.map((msg, idx) => (
            <motion.div
              key={`msg-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-sm p-2 rounded-lg max-w-[85%] flex",
                msg.type === "ai"
                  ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-100"
                  : "bg-blue-500/10 dark:bg-blue-500/20 text-blue-900 dark:text-blue-100 ml-auto"
              )}
            >
              {msg.text}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-1 p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg w-fit"
            >
              <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </motion.div>
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enhance your README..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDemo}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isDemo || !inputValue.trim()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
      
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 text-center">
        {isDemo ? "Click chat area to enable interaction" : "Type your message and press Enter"}
      </p>
    </div>
  );
}

const BentoCard = ({ item }: { item: BentoItem }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
      onHoverEnd={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <a
        href={item.href || "#"}
        className={`group relative flex flex-col gap-4 h-full rounded-xl p-5 bg-linear-to-b from-neutral-50/60 via-neutral-50/40 to-neutral-50/30 dark:from-neutral-900/60 dark:via-neutral-900/40 dark:to-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-b before:from-white/10 before:via-white/20 before:to-transparent dark:before:from-black/10 dark:before:via-black/20 dark:before:to-transparent before:opacity-100 before:transition-opacity before:duration-500 after:absolute after:inset-0 after:rounded-xl after:bg-neutral-50/70 dark:after:bg-neutral-900/70 after:z-[-1] backdrop-blur-xs shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] hover:border-neutral-300/50 dark:hover:border-neutral-700/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:backdrop-blur-[6px] hover:bg-linear-to-b hover:from-neutral-50/60 hover:via-neutral-50/30 hover:to-neutral-50/20 dark:hover:from-neutral-800/60 dark:hover:via-neutral-800/30 dark:hover:to-neutral-800/20 transition-all duration-500 ease-out ${item.className}`}
        tabIndex={0}
        aria-label={`${item.title} - ${item.description}`}
      >
        <div
          className="relative z-10 flex flex-col gap-3 h-full"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300">
                {item.title}
              </h3>
              <div className="text-neutral-400 dark:text-neutral-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 tracking-tight">
              {item.description}
            </p>

            {item.feature === "spotlight" && item.spotlightItems && (
              <SpotlightFeature items={item.spotlightItems} />
            )}

            {item.feature === "timeline" && item.timeline && (
              <TimelineFeature timeline={item.timeline} />
            )}

            {item.feature === "icons" && <IconsFeature />}

            {item.feature === "typing" && item.typingText && (
              <TypingCodeFeature text={item.typingText} />
            )}
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default function BentoGrid() {
  return (
    <section className="relative pt-12 pb-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-6"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp} className="md:col-span-1">
              <BentoCard item={bentoItems[0]} />
            </motion.div>
            <motion.div variants={fadeInUp} className="md:col-span-2">
              <BentoCard item={bentoItems[1]} />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeInUp} className="md:col-span-1">
              <BentoCard item={bentoItems[2]} />
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="md:col-span-1 rounded-xl overflow-hidden bg-linear-to-b from-neutral-50/80 to-neutral-50 dark:from-neutral-900/80 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-400/30 dark:hover:border-neutral-600/30 hover:shadow-lg hover:shadow-neutral-200/20 dark:hover:shadow-neutral-900/20 transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Interactive Chat
                  </h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 tracking-tight mb-4">
                  Chat with AI to enhance and refine your README. Add sections, improve clarity, or adjust the tone—all in real-time.
                </p>
                <InteractiveChatDemo />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}