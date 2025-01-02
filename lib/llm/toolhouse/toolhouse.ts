import { Toolhouse } from "@toolhouseai/sdk";

export const toolhouse = new Toolhouse({
    apiKey: process.env.TOOLHOUSE_API_KEY,
    provider: "vercel",
});

