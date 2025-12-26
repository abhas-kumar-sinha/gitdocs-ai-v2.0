'use client';

import { ProgressEvent } from '@/types/readmeAi';
import { useEffect, useState, useRef } from 'react';

export function useProgressTracking(projectId: string) {
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`/api/projects/${projectId}/progress`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ProgressEvent;
        
        if (data.type === 'connected') {
          return;
        }

        setProgress(data);

        if (data.completed) {
          setIsComplete(true);
        }

        if (data.error) {
          setError(data.message);
        }
      } catch (e) {
        console.error('Failed to parse SSE data:', e);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [projectId]);

  return { progress, isComplete, error, isConnected };
}