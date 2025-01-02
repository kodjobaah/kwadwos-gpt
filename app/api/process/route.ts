import { createAndStoreChunks, ensureCollection } from "@/lib/astradb";
import { arrayBufferToBlob, extractDataFromCSV, extractTextFromPDF, getLoggedInUserEmailPrefix } from "@/lib/documents/helpers";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    const emailPrefix = await getLoggedInUserEmailPrefix()
    const COLLECTION_NAME = "documents" + emailPrefix;

    try {

        const collection = await ensureCollection(COLLECTION_NAME)

        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No files provided' },
                { status: 400 }
            );
        }

        const results = [];

        for (const file of files) {
            let text: string;

            let chunksResult;
            // Handle file based on type
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const blob = arrayBufferToBlob(buffer)
                text = await extractTextFromPDF(blob);
                chunksResult = await createAndStoreChunks(text, file, collection)
            } else if (file.type === 'text/csv') {
                console.log("---- extract")
                chunksResult = await extractDataFromCSV(file, collection);
                text = "processed";
            } else {
                text = "";
            }

            if (!text.trim()) {
                console.warn(`Empty content for ${file.name}`);
                continue;
            }

            
            results.push(...chunksResult);
        }

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error('Error processing files:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
