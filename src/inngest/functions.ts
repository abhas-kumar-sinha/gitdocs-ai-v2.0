import { openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

const SupportedModels = [
  {
    model: "gpt-4.1",
    defaultParameters: {temprature: 0.7},
    performance: {
      qualityIndex: 0.83,
      saftey: 9.83,
      tps: 95,
      cost: 3.5
    },
    toolCalling: true
  },
  {
    model: "gpt-5-nano",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.83,
      saftey: 1.67,
      tps: 224,
      cost: 0.14
    },
    toolCalling: true
  },
  {
    model: "gpt-5-mini",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.89,
      saftey: 0.53,
      tps: 127,
      cost: 0.69
    },
    toolCalling: true
  },
  {
    model: "gpt-5.1-chat",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.90,
      saftey: 0.34,
      tps: 76,
      cost: 3.44
    },
    toolCalling: true
  },
  {
    model: "gpt-5.2-chat",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.83,
      saftey: 9.83,
      tps: 95,
      cost: 3.5
    },
    toolCalling: true
  },
  {
    model: "o4-mini",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.89,
      saftey: 2.33,
      tps: 52,
      cost: 1.93
    },
    toolCalling: true
  }
]

export const aiCall = inngest.createFunction(
  { id: "summarize-contents" },
  { event: "app/ticket.created" },
  async ({ event }) => {

    const writer = createAgent({
      name: "writer",
      system: "You are an expert writer. You write readable, very concise, simple content.",
      model: openai({
        model: "o4-mini",
        apiKey: process.env.AZURE_OPENAI_API_KEY!,
        baseUrl: process.env.AZURE_OPENAI_ENDPOINT!,
        defaultParameters: { temperature: 1 },
      }),
    });

    const { output } = await writer.run(event.data.value);

    console.log(output);

    return { output };
  }
);
