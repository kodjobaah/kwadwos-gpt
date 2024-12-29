'use server';

import { auth, currentUser } from '@clerk/nextjs/server'
import { pipeline, env } from "@huggingface/transformers";
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Pi } from 'lucide-react';

    
export async function getLoggedInUser() {
    
    return await currentUser();
}

export async function getLoggedInUserEmail() {

    const user = await getLoggedInUser();

    return user.emailAddresses[0].emailAddress;


}

export async function getLoggedInUserEmailPrefix() {

    const email = await getLoggedInUserEmail();
    return email.split('@')[0];
}



// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance =  await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {

                progress_callback,
            });
            // this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}
export async function generateEmbeddingPipeline(text: string) {

    const featureExtraction = await PipelineSingleton.getInstance();
    const embedding = featureExtraction(text);
    JSON.stringify(embedding);
    return embedding;


}
// Function to generate embeddings
// Function to ensure collection exists
export async function generateEmbedding(text: string) {
    try {
        const cleanText = text.trim();
        if (!cleanText) {
            throw new Error("Empty text provided");
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: cleanText,
                    options: {
                        wait_for_model: true
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HuggingFace API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error in generateEmbedding:", error);
        throw error;
    }
}




// Function to extract text from PDF
export async function extractTextFromPDF(pdfBuffer: Blob): Promise<string> {
    try {
        const loader = new PDFLoader(pdfBuffer);
        const documents = await loader.load();
        return documents.map(doc => doc.pageContent).join("\n");
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
}




