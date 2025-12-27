'use client';

import { useEffect } from 'react';
import { Progress } from '../ui/progress';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle } from 'lucide-react';
import ShimmerText from '../kokonutui/shimmer-text';
import { useAiContext } from '@/contexts/AiContext';
import { useQueryClient } from '@tanstack/react-query';
import { useProgressTracking } from '@/hooks/useProgressTracking';

export function ProgressTracker({ projectId }: { projectId: string }) {
  const { progress, isComplete, error, isConnected } = useProgressTracking(projectId);
  const { setIsGenerating } = useAiContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Handle completion/error logic
  useEffect(() => {

    if (!isComplete) {
      setIsGenerating(true);
    }

    if (isComplete || error) {
      queryClient.invalidateQueries({
        queryKey: [['message', 'getMany'], { input: { projectId } }]
      });
      queryClient.invalidateQueries({
        queryKey: [['project', 'getById'], { input: { id: projectId } }]
      });
      queryClient.invalidateQueries({
        queryKey: [['aiUsage', 'getUsage']]
      });
      router.refresh();
      setIsGenerating(false);
    }
  }, [isComplete, router, projectId, queryClient, error, setIsGenerating]);

  return (
    <div className="w-full max-w-93.5 me-auto font-sans antialiased mb-10 mt-4">
      <div className="rounded-xl bg-sidebar/40 pt-3 pb-4 px-3 text-gray-200 border border-[#2d2d2d] shadow-xl">
        
        {/* Header Section */}
        <div className="mb-3">
          {error ? (
             <div className="font-normal text-sm flex ms-1 items-center gap-2 text-red-400">
               <AlertCircle size={15} />
               <span>Generation Failed</span>
             </div>
          ) : isComplete ? (
            <div className="font-normal text-sm flex ms-1 items-center gap-2 text-green-400">
              <Check size={15} />
              <span>Finished</span>
            </div>
          ) : (
            <ShimmerText text="Thinking... This may take a while..." className="text-sm -mb-2.5 -mt-1.5 from-[#22A7BD]! via-[#5c3185]! to-[#4754d6]! font-light" />
          )}
        </div>

        {/* Code/Terminal Block */}
        <div className="relative">
          <div className="w-full bg-muted rounded-xl py-3 px-3 min-h-20 font-mono text-xs border border-[#2d2d2d] flex flex-col justify-between">
            
            {/* Content Area */}
            <div className="text-gray-300 whitespace-pre-wrap wrap-break-words">
              {!isConnected && !error ? (
                <span>Connecting to server...</span>
              ) : (
                <>
                  {progress?.message || "Initializing..."}
                  {/* Blinking Cursor */}
                  {!isComplete && !error && (
                    <span
                      className="
                        inline-block w-0.5 h-4 ml-1 -mt-1 align-middle bg-gray-400
                        animate-[blink_1s_steps(1,end)_infinite]
                      "
                    />
                  )}
                </>
              )}
            </div>

            {/* Subtle Progress Bar (Simulating the 'loading' feel within the card) */}
            {progress && !isComplete && !error && (
              <Progress className='mt-4' value={progress.progress} />
            )}
            
            {/* Detail Stats (Optional, styled cleanly) */}
            {progress && (
              <div className="mt-4 flex gap-3 text-xs text-gray-500 font-sans border-t border-[#2d2d2d] pt-3">
                {progress.repoName && <span>📦 {progress.repoName}</span>}
                {progress.fileCount && <span>📄 {progress.fileCount} files</span>}
                {progress.frameworks && progress.frameworks?.length > 0 && <span>🔧 {progress.frameworks[0]}</span>}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}