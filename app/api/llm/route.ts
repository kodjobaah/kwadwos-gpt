import prisma from '@/lib/db';
import { QuestionAnswerPipelineSingleton } from '@/lib/huggingface/question-ans-pipeline';
import { performRagSearch } from '@/lib/llm/agent/vercel';
import { LLMRequestBody } from '@/lib/model/types';
import { NextRequest, NextResponse } from 'next/server';
import markdownit from 'markdown-it'



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
        
        to you best of abilities. 
    
        Please use the information provided below to assist you, if it is helpful

        ${data.join(' ')}
        
        `

        const result = await performRagSearch(prompt, pipelineContext);

        // Enable everything
        const md = markdownit({
            html: true,
            linkify: true,
            typographer: true,
        });

        const out = await prisma.ragSearchResults.create({
            data: {
                answer: md.render(result.content),
                prompt: { prompt },
                astraDoc: selectedDoc
            }
        });

        return NextResponse.json({ id: out.id, ...result });
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

