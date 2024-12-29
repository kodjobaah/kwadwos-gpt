import { Collection, DataAPIClient, SomeDoc } from "@datastax/astra-db-ts";
import { generateEmbedding } from "./documents/helpers";
import chunks from "chunk-text";

// Initialize the client
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_ENDPOINT);

export function arrayBufferToBlob(arrayBuffer, mimeType = "application/octet-stream") {
    return new Blob([arrayBuffer], { type: mimeType });
}


// Function to ensure collection exists
export async function ensureCollection(collectionName: string): Promise<Collection<SomeDoc>> {
    try {
        const collection = await db.createCollection(collectionName, {
            vector: {
                service: {
                    provider: 'nvidia',
                    modelName: 'NV-Embed-QA',
                },
            },
        });
        console.log(`* Created collection ${collection.keyspace}.${collection.collectionName}`);
        return collection;
    } catch (error: any) {
        if (error.message && error.message.includes('already exists')) {
            console.log(`Collection ${collectionName} already exists`);
            return db.collection(collectionName);
        }
        throw error;
    }
}

export async function createAndStoreChunks(text: string, file: File, collection: Collection<SomeDoc>) {

    const results = [];

    const textChunks = chunks(text, 500);

    const BATCH_SIZE = 1;
    for (let i = 0; i < textChunks.length; i += BATCH_SIZE) {
        const batchChunks = textChunks.slice(i, i + BATCH_SIZE);

        try {
            const batchEmbeddings = await Promise.all(
                batchChunks.map(chunk => generateEmbedding(chunk))
            );

            const documents = [];
            for (let j = 0; j < batchChunks.length; j++) {
                if (batchEmbeddings[j]) {
                    // Insert documents into the collection (using UUIDv7s)
                    documents.push({
                        filename: file.name,
                        text: batchChunks[j],
                        $vectorize: batchChunks[j],
                    });
                    results.push({
                        chunk: batchChunks[j].substring(0, 100) + "...",
                        filename: file.name
                    });
                }
            }

            try {
                const inserted = await collection.insertMany(documents);
                console.log(`* Inserted ${inserted.insertedCount} items.`);
            } catch (e) {
                console.log('* Documents found on DB already. Let\'s move on!');
            }

            if (i + BATCH_SIZE < textChunks.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error(`Error processing batch starting at index ${i}:`, error);
            throw error;
        }
    }
    return results;
}

export async function buildChunks(textChunks, collection, file) {

    const BATCH_SIZE = 1;
    const results = [];
    for (let i = 0; i < textChunks.length; i += BATCH_SIZE) {
        const batchChunks = textChunks.slice(i, i + BATCH_SIZE);

        try {
            const batchEmbeddings = await Promise.all(
                batchChunks.map(chunk => generateEmbedding(chunk))
            );

            for (let j = 0; j < batchChunks.length; j++) {
                if (batchEmbeddings[j]) {
                    await collection.insertOne({
                        text: batchChunks[j],
                        filename: file.name,
                        embedding: batchEmbeddings[j],
                        timestamp: new Date().toISOString()
                    });

                    results.push({
                        chunk: batchChunks[j].substring(0, 100) + "...",
                        filename: file.name
                    });
                }
            }


            if (i + BATCH_SIZE < textChunks.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error(`Error processing batch starting at index ${i}:`, error);
            throw error;
        }
    }
}
