"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- Types & Configuration ---

type QuestionType = "multipleChoice" | "singleChoice" | "shortText" | "longText" | "scale";

// Define what an answer can be
export type AnswerValue = string | string[] | number | null;

interface Question {
  id: string;
  type: QuestionType;
  label: string;
  helperText?: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: "intent",
    type: "multipleChoice",
    label: "What did you try to do with Gitdocs AI today?",
    helperText: "Choose as many as you like.",
    options: [
      "Improve an existing README",
      "Generate a new README",
      "Understand a repository",
      "Explore the product",
      "Something else",
    ],
    required: true,
  },
  {
    id: "outcome",
    type: "singleChoice",
    label: "Did Gitdocs AI help you achieve that?",
    options: ["Yes, fully", "Partially", "Not really"],
    required: true,
  },
  {
    id: "outputQuality",
    type: "scale",
    label: "How would you rate the quality of the generated output?",
    helperText: "1 = Poor, 10 = Excellent",
    required: true,
  },
  {
    id: "friction",
    type: "shortText",
    label: "What was the most confusing or frustrating part?",
    helperText: "One sentence is enough.",
    placeholder: "e.g., The login process was slow...",
    required: true,
  },
  {
    id: "insight",
    type: "longText",
    label: "If you could change one thing, what would it be?",
    placeholder: "Better README structure suggestions, faster responses, clearer UI…",
    required: true,
  },
  {
    id: "repoType",
    type: "multipleChoice",
    label: "What kind of repository were you working with?",
    options: [
      "Personal project",
      "Open-source project",
      "Startup / company repo",
      "College / learning project",
      "I didn't connect a repo",
    ],
    required: true,
  },
  {
    id: "missingFeature",
    type: "shortText",
    label: "Was there anything you expected Gitdocs AI to do but it couldn't?",
    placeholder: "e.g., Auto-detect tech stack, better badges, folder-level docs…",
    required: false,
  },
  {
    id: "nps",
    type: "scale",
    label: "How likely are you to use Gitdocs AI again?",
    helperText: "1 = Not likely, 10 = Very likely",
    required: false,
  },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function TypeformFeedback({ onComplete, setIsFeedbackFormOpen }: { onComplete?: (answers: Record<string, AnswerValue>) => void, setIsFeedbackFormOpen: (open: boolean) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  const answersRef = useRef<Record<string, AnswerValue>>({});
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const currentQuestion = QUESTIONS[currentStep];
  const totalSteps = QUESTIONS.length;

  // --- Validation ---
  const validateAnswer = useCallback((questionId: string, value: AnswerValue, question: Question): boolean => {
    if (!question.required) return true;
    
    const isEmpty = 
      value === undefined || 
      value === null || 
      value === "" || 
      (Array.isArray(value) && value.length === 0);

    return !isEmpty;
  }, []);

  // --- Logic ---
  const handleAnswerChange = useCallback((value: AnswerValue) => {
    setAnswers((prev) => {
      const newState = { ...prev, [currentQuestion.id]: value };
      answersRef.current = newState;
      return newState;
    });
    setError("");
  }, [currentQuestion.id]);

  const handleNext = useCallback(() => {
    const currentVal = answersRef.current[currentQuestion.id];
    
    if (!validateAnswer(currentQuestion.id, currentVal, currentQuestion)) {
      setError("This question is required - please provide an answer");
      return;
    }

    setError("");

    if (currentStep < totalSteps - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 150);
    } else {
      // Before completing, check if all required questions are answered
      const incompleteRequired = QUESTIONS.findIndex((q) => {
        if (!q.required) return false;
        const answer = answersRef.current[q.id];
        const isEmpty = 
          answer === undefined || 
          answer === null || 
          answer === "" || 
          (Array.isArray(answer) && answer.length === 0);
        return isEmpty;
      });
      
      if (incompleteRequired !== -1) {
        setError(`Please complete all required questions. Jumping to question ${incompleteRequired + 1}...`);
        setTimeout(() => {
          setCurrentStep(incompleteRequired);
          setError("");
        }, 1500);
        return;
      }
      
      setIsCompleted(true);
      if (onComplete) onComplete(answersRef.current);
    }
  }, [currentStep, currentQuestion, totalSteps, onComplete, validateAnswer]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setError("");
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleNavClick = useCallback((direction: 'next' | 'prev') => {
    if (direction === 'next') {
      handleNext();
    } else {
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  const toggleSelection = useCallback((option: string) => {
    const current = (answersRef.current[currentQuestion.id] as string[]) || [];
    if (current.includes(option)) {
      handleAnswerChange(current.filter((item) => item !== option));
    } else {
      handleAnswerChange([...current, option]);
    }
  }, [currentQuestion.id, handleAnswerChange]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if user is typing in a textarea with shift+enter
      const target = e.target as HTMLElement;
      const isTextarea = target.tagName === 'TEXTAREA';
      
      // Enter Key Logic
      if (e.key === "Enter") {
        if (currentQuestion.type === "longText") {
          // Shift + Enter = New line (default behavior), don't submit
          if (e.shiftKey) return; 
          
          // Enter only = Submit
          e.preventDefault(); 
          handleNext();
          return;
        }

        // For all other inputs, Enter = Submit
        e.preventDefault();
        handleNext();
      }

      // Don't process other shortcuts if typing in textarea
      if (isTextarea && !e.ctrlKey && !e.metaKey) return;

      // Shortcuts for Single Choice (A, B, C...)
      if (currentQuestion.type === "singleChoice" || currentQuestion.type === "multipleChoice") {
        const keyIndex = ALPHABET.indexOf(e.key.toUpperCase());
        if (keyIndex !== -1 && currentQuestion.options && currentQuestion.options[keyIndex]) {
          e.preventDefault();
          const option = currentQuestion.options[keyIndex];
          if (currentQuestion.type === "singleChoice") {
            handleAnswerChange(option);
            // Small delay to allow state to settle
            setTimeout(handleNext, 300);
          } else {
            toggleSelection(option);
          }
        }
      }

      // Number keys for Scale (1-9 and 0 for 10)
      if (currentQuestion.type === "scale") {
        const key = e.key;
        let num: number | null = null;
        
        if (key === "0") {
          num = 10; // 0 key represents 10
        } else {
          const parsed = parseInt(key);
          if (parsed >= 1 && parsed <= 9) {
            num = parsed;
          }
        }
        
        if (num !== null) {
          e.preventDefault();
          handleAnswerChange(num);
          setTimeout(handleNext, 300);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, handleNext, toggleSelection, handleAnswerChange]);

  // Focus input on step change
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [currentStep]);

  // Sync state to Ref on mount (edge case safety)
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // --- Renderers ---
  const renderInput = () => {
    switch (currentQuestion.type) {
      case "multipleChoice":
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 pt-2">
              {currentQuestion.options?.map((option, idx) => {
                const currentVal = (answers[currentQuestion.id] as string[]) || [];
                const isSelected = currentVal.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => toggleSelection(option)}
                    className={cn(
                      "group flex items-center justify-between p-3 px-4 border rounded-md cursor-pointer transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 border-primary shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-none ring-1 ring-primary"
                        : "bg-background hover:bg-muted border-input"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex items-center justify-center w-6 h-6 text-xs font-bold border rounded-sm transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border group-hover:border-primary"
                        )}
                      >
                        {ALPHABET[idx]}
                      </span>
                      <span className="text-lg">{option}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-primary animate-in zoom-in duration-200" />}
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground/70 text-center hidden md:block">
              Press <span className="font-bold">A-{ALPHABET[currentQuestion.options!.length - 1]}</span> to select options
            </div>
          </div>
        );

      case "singleChoice":
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 pt-2">
              {currentQuestion.options?.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option;
                return (
                  <div
                    key={option}
                    onClick={() => {
                      handleAnswerChange(option);
                      setTimeout(handleNext, 350); 
                    }}
                    className={cn(
                      "group flex items-center gap-3 p-3 px-4 border rounded-md cursor-pointer transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 border-primary ring-1 ring-primary"
                        : "bg-background hover:bg-muted border-input"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-6 h-6 text-xs font-bold border rounded-sm transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border group-hover:border-primary"
                      )}
                    >
                      {ALPHABET[idx]}
                    </span>
                    <span className="text-lg">{option}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground/70 text-center hidden md:block">
              Press <span className="font-bold">A-{ALPHABET[currentQuestion.options!.length - 1]}</span> to select and continue
            </div>
          </div>
        );

      case "shortText":
        return (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={(answers[currentQuestion.id] as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="text-2xl md:text-3xl h-auto py-4 bg-transparent border-0 border-b border-primary/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/40 transition-colors"
          />
        );

      case "longText":
        return (
          <div className="relative">
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={(answers[currentQuestion.id] as string) || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="text-xl md:text-2xl min-h-[120px] bg-transparent border-0 border-b border-primary/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary resize-none placeholder:text-muted-foreground/40 leading-relaxed scrollbar-hide"
            />
            <div className="absolute bottom-[-25px] right-0 text-xs text-muted-foreground">
              <span className="font-semibold">Shift ⇧ + Enter ↵</span> for line break
            </div>
          </div>
        );

      case "scale":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 pt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    handleAnswerChange(num);
                    setTimeout(handleNext, 300);
                  }}
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-md border-2 text-xl font-bold transition-all duration-200 flex items-center justify-center",
                    answers[currentQuestion.id] === num
                      ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg"
                      : "bg-background border-muted-foreground/20 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="w-full flex justify-between text-sm text-muted-foreground px-1">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
            <div className="text-xs text-muted-foreground/70 text-center hidden md:block">
              Press <span className="font-bold">1-9</span> or <span className="font-bold">0</span> (for 10) on your keyboard
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // --- Completion State ---
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in duration-500 max-w-lg mx-auto">
        <div className="bg-primary/10 p-6 rounded-full mb-8 text-primary">
          <Check size={64} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Feedback Received</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Thanks for helping us build a better product. Your insights have been logged.
        </p>
        <Button size="lg" onClick={() => setIsFeedbackFormOpen(false)}>
          Close Form
        </Button>
      </div>
    );
  }

  // --- Main Render ---
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  // Calculate completion status for each question
  const questionStatus = QUESTIONS.map((q, idx) => {
    const answer = answers[q.id];
    const isEmpty = 
      answer === undefined || 
      answer === null || 
      answer === "" || 
      (Array.isArray(answer) && answer.length === 0);
    
    return {
      index: idx,
      isAnswered: !isEmpty,
      isRequired: q.required,
      isCurrent: idx === currentStep
    };
  });

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto relative px-6 md:px-0 font-sans">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      {/* Question Dots Indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-50 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full border border-border shadow-sm">
        {questionStatus.map((status) => (
          <button
            key={status.index}
            onClick={() => {
              setError("");
              setCurrentStep(status.index);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125",
              status.isCurrent && "scale-150",
              status.isAnswered 
                ? "bg-primary" 
                : status.isRequired 
                  ? "bg-muted-foreground/30 ring-1 ring-primary/50" 
                  : "bg-muted-foreground/20"
            )}
            title={`Question ${status.index + 1}${status.isRequired ? ' (required)' : ''}`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Question Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest">
                <span>Question {currentStep + 1}</span>
                <ArrowRight size={14} />
              </div>

              <h2 className="text-3xl md:text-4xl font-light leading-tight text-foreground">
                {currentQuestion.label}
                {currentQuestion.required && (
                  <span className="text-red-500 ml-1 text-2xl align-top">*</span>
                )}
              </h2>

              {currentQuestion.helperText && (
                <p className="text-lg text-muted-foreground mt-2 font-light">
                  {currentQuestion.helperText}
                </p>
              )}
            </div>

            {/* Input Area */}
            <div className="relative pb-12">
              {renderInput()}

              {/* Error Notification */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-0 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm px-4 py-2 rounded-md flex items-center gap-2 border border-red-200 dark:border-red-800"
                  >
                    <span className="font-bold text-base">⚠</span> 
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions / Navigation */}
            <div className="pt-8 flex items-center gap-4">
              <Button
                onClick={handleNext}
                size="lg"
                className="text-lg px-8 py-6 h-auto font-medium shadow-md transition-transform active:scale-95"
              >
                {currentStep === totalSteps - 1 ? "Submit" : "OK"}
                <Check className="ml-2 w-5 h-5" />
              </Button>

              <div className="text-xs text-muted-foreground hidden md:flex items-center gap-2">
                press <span className="font-bold">Enter ↵</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Navigation Controls */}
      <div className="fixed bottom-6 right-6 flex gap-0 rounded-md bg-card shadow-lg border border-border overflow-hidden z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="h-10 w-10 rounded-none border-r hover:bg-muted disabled:opacity-50"
          title="Previous question (↑)"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavClick('next')}
          disabled={currentStep === totalSteps - 1}
          className="h-10 w-10 rounded-none hover:bg-muted disabled:opacity-50"
          title="Next question (↓)"
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="fixed bottom-6 left-6 text-xs text-muted-foreground/50 hidden md:block">
        Powered by <span className="font-semibold">Gitdocs AI</span>
      </div>
    </div>
  );
}