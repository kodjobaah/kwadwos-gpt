import { createOpenAI } from '@ai-sdk/openai';

/*
export const openai = createOpenAI({
  baseURL: 'https://api-inference.huggingface.co/v1/',
  apiKey: process.env.HUGGINGFACE_API_KEY,
});
*/

export const openai = createOpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEP_SEEK_API_KEY,
  });
  

