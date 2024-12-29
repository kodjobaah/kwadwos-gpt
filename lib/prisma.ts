'use server';

import prisma from "./db";
import { promptDetailsSchema, QuestionAndAnswerResponse, questionAndAnswerResultSchema } from "./model/types";

export async function fetchRagResults(
    documentStore: string,
    skip: number = 0,
    take: number = 10
  ): Promise<QuestionAndAnswerResponse[]> {
  
      const resp = await prisma.ragSearchResults.findMany({
          where: {
              astraDoc: documentStore
          },
          skip: skip,
          take: take
      });
  
      const out: QuestionAndAnswerResponse[]  = resp.map((res) => {
          const qanda = questionAndAnswerResultSchema.safeParse(res.answer);
          const prompt = promptDetailsSchema.safeParse(res.prompt);
          const qa: QuestionAndAnswerResponse = {
              questionAndAnswer: qanda.data,
              prompt: prompt.data,
              update: res.updatedAt, 
          };
          return qa;
      });
  
      return out;
  }
  