'use server';

import { UpdateQuestionAndAnswer } from "../model/types";
import { fetchRagResults } from "../prisma";

export const updateQuestionAndAnswers = async (up: UpdateQuestionAndAnswer) => {
    console.log("update-question-and-answers")
  const res = await fetchRagResults(up.astraDoc as string, up.currentPage * 2, 2);
  console.log("New Resonse:"+JSON.stringify(res));
  if (!res || res.length === 0) {
    up.setHasMore(false);
  } else {
    up.setRagSearchResults(res);
  }

  return res;
};