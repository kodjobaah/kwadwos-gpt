import prisma from '@/lib/db';
import { QuestionAnswerPipelineSingleton } from '@/lib/huggingface/question-ans-pipeline';
import { LLMRequestBody } from '@/lib/model/types';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = (await req.json()) as LLMRequestBody;
        const { prompt, context, selectedDoc } = body;
        console.log(context)

        const data = [];
        if (context) {
            for (const item of context) {
                data.push(item.text);
            }
        }
        const pipelineContext = `you are a help assistant. That will answer any question put to you 
        
        to you best of abilities. If it is possible use the following to help in formulating your answer 
        
        """${data.join()}""""
        `
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -start");
        console.log(JSON.stringify(pipelineContext))
        const answerer = await QuestionAnswerPipelineSingleton.getInstance();
        const results = await answerer(prompt, pipelineContext);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -before answer");
        console.log(results)

        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -end");
        // Validate input

        await prisma.ragSearchResults.create({
            data: {
                answer: results,
                prompt: {prompt},
                astraDoc: selectedDoc
            }
        });
        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Error performing search:', error);

        return NextResponse.json(
            {
                error: error.message,
                details: JSON.stringify(error.detailedErrorDescriptors) || error,
            },
            { status: 500 }
        );
    }
}
