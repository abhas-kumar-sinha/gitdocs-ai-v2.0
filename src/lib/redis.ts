import { ProgressEvent } from "@/types/readmeAi";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);
const redisSub = new Redis(process.env.REDIS_URL!);

export const publishProgress = async (
  projectId: string,
  data: ProgressEvent,
) => {
  await redis.publish(`project:${projectId}:progress`, JSON.stringify(data));
};

export const subscribeToProgress = (
  projectId: string,
  callback: (data: ProgressEvent) => void,
) => {
  const channel = `project:${projectId}:progress`;

  redisSub.subscribe(channel, (err) => {
    if (err) console.error("Failed to subscribe:", err);
  });

  redisSub.on("message", (ch, message) => {
    if (ch === channel) {
      callback(JSON.parse(message));
    }
  });

  return () => redisSub.unsubscribe(channel);
};
