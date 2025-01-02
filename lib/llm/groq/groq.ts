import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});



export const invokeLLMSummarization = async (prompt) => {

  const system: string = `
  As a professional summarizer, create a concise and comprehensive summary of the provided text, be it an article, post, conversation, 
  or passage, while adhering to these guidelines:

  Craft a summary that is detailed, thorough, in-depth, and complex, while maintaining clarity and conciseness.

  Incorporate main ideas and essential information, eliminating extraneous language and focusing on critical aspects.

  Rely strictly on the provided text, without including external information.

  This will be used in a larger context to answer questions about the law.

  Format the summary in paragraph form for easy understanding.

  Conclude your notes with [End of Notes, Message #X] to indicate completion, where "X" represents the total number of messages that I have sent. In other words, include a message counter where you start with #1 and add 1 to the message counter every time I send a message.
  `
  const response = await generateText({
    model: groq('llama-3.1-8b-instant'),
    prompt: prompt,
    system: system,
    maxSteps: 5,
  });

  return response;
}
