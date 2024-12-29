import { AstraDocument, AstraDocumentData } from '@/lib/model/astra';
import { DataAPIClient } from '@datastax/astra-db-ts'; // Install via `npm install @datastax/astra-db-ts`
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Astra DB client
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN!, {
    dbOptions: {
        monitorCommands: true,
    },
});

client.on('commandStarted', (event) => {
    console.log(`Running command ${event.commandName}`);
});

client.on('commandSucceeded', (event) => {
    console.log(`Command ${JSON.stringify(event)} ${event.commandName} succeeded in ${event.duration}ms`);
});

client.on('commandFailed', (event) => {
    console.error(`Command ${event.commandName} failed w/ error ${event.error}`);
});
const astraClient = client.db(process.env.ASTRA_DB_ENDPOINT!);

interface SearchRequestBody {
    query: string;
    collectionName: string;
}



export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = (await req.json()) as SearchRequestBody;
        const { query, collectionName } = body;

        // Validate input
        if (!query || !collectionName) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Get the collection
        const collection = astraClient.collection(collectionName);
        // const embeddings = await generateEmbedding(query);
        const cursor = collection.find({}, {
            sort: { $vectorize: query },
            limit: 10,
            includeSimilarity: true,
        });

        const docs: AstraDocumentData[] = [];
        for await (const doc of cursor) {

            docs.push({
                id: doc._id.toString(),
                filename: doc.filename,
                text: doc.text,
                similarity: doc.$similarity,
            });
        }

        const result: AstraDocument = {
            documents: docs,
        }
        return NextResponse.json(result);
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
