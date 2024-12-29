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

export const promptDetailsSchema = z.object({
    prompt: z.string(),
});

export type PromptDetails = z.infer<typeof promptDetailsSchema>;

export const questionAndAnswerResponseSchema = z.object({
    questionAndAnswer: questionAndAnswerResultSchema,
    prompt: promptDetailsSchema,
    update: z.date(),
})

export type QuestionAndAnswerResponse = z.infer<typeof questionAndAnswerResponseSchema>


export interface UpdateQuestionAndAnswer {
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setRagSearchResults: React.Dispatch<React.SetStateAction<QuestionAndAnswerResponse[]>>;
  currentPage: number;
  astraDoc: string;
}
