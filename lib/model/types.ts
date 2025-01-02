import { z } from "zod";
import { astraDocumentDataSchema } from "./astra";
import React from "react";

const llmRequestBodySchema = z.object({

    context: z.array(astraDocumentDataSchema),
    prompt: z.string(),
    selectedDoc: z.string(),

});

export type LLMRequestBody = z.infer<typeof llmRequestBodySchema>;

const ragSearchResultsSchema = z.object({
    astraDoc: z.string()
})

export type RagSearchResults = z.infer<typeof ragSearchResultsSchema>;

export const questionAndAnswerResultSchema = z.object({
    answer: z.string(),
    score: z.number(),
})

export type questionAndAnswerResult = z.infer<typeof questionAndAnswerResultSchema>

export const promptSchema = z.object({
    content: z.string(),
    role: z.string(),
    
});

export type Prompt = z.infer<typeof promptSchema>;

export const promptDetailsSchema = z.object({
    prompt: z.string(),
});

export type PromptDetails = z.infer<typeof promptDetailsSchema>;

export const questionAndAnswerResponseSchema = z.object({
    questionAndAnswer: questionAndAnswerResultSchema,
    prompt: promptDetailsSchema,
    update: z.date(),
})

export const languageModelUsageSchema = z.object({
        /**
      The number of tokens used in the prompt.
         */
        promptTokens: z.number(),
        /**
      The number of tokens used in the completion.
       */
        completionTokens: z.number(),
        /**
      The total number of tokens used (promptTokens + completionTokens).
         */
        totalTokens: z.number(),

})
export type LanguageModelUsage = z.infer<typeof languageModelUsageSchema>; 

export const groqResponseSchema = z.object({
    content: z.string(),
    usage: languageModelUsageSchema,
}
)

export type GroqResponse = z.infer<typeof groqResponseSchema>


export type QuestionAndAnswerResponse = z.infer<typeof questionAndAnswerResponseSchema>


export interface UpdateQuestionAndAnswer {
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setRagSearchResults: React.Dispatch<React.SetStateAction<QuestionAndAnswerResponse[]>>;
  currentPage: number;
  astraDoc: string;
}


