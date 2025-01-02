import 'server-only'
import { Collection, DataAPIClient, SomeDoc } from "@datastax/astra-db-ts";
import { generateEmbedding } from "./documents/helpers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";

// Initialize the client
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_ENDPOINT);


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


export async function astradbSearch(searchTerm: string, collection: Collection<SomeDoc>) {
      // Perform a similarity search
  const cursor =  collection.find({}, {
    sort: { $vectorize: searchTerm},
    limit: 2,
    includeSimilarity: true,
  });

  const content = [];
  for await (const doc of cursor) {
    content.push(doc.text);
  }
  console.log('**************** Search results:', content.join(''));
  

}



export async function createAndStoreChunks(text: string, file: File, collection: Collection<SomeDoc>) {

    const results = [];
    console.log('0-1', text.length)
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 3,
    });

    const textChunks = await splitter.splitDocuments([
        new Document({ pageContent: text }),
    ]);

    const BATCH_SIZE = 1;
    let cur = 0;
    for (const doc of textChunks) {
        const documents = [];
       // for (let i = cur; (i < cur + BATCH_SIZE && i < textChunks.length); i += 1) {
            // const batchChunks = doc.pageContent.slice(i, i + BATCH_SIZE);
            // if (batchChunks && batchChunks[0]) {
            //     console.log('chunkdefined')
            //     documents.push({
            //     filename: file.name,
            //     text: batchChunks[0],
            //     $vectorize: batchChunks[0],
            // });
            documents.push({
                filename: file.name,
                text: doc.pageContent,
                $vectorize: doc.pageContent
            })
            results.push({
                chunk: doc.pageContent.substring(0, 100) + "...",
                filename: file.name
            });
       // } else {
        //    console.log('chnyn-undefined', JSON.stringify(batchChunks));
       // }
            console.log("1-2");

               //// 
       // }

        try {
            console.log("1-3:" + documents.length);
            const inserted = await collection.insertMany(documents);
            console.log(`* Inserted ${inserted.insertedCount} items.`);
        } catch (e) {
            console.log('* Documents found on DB already. Let\'s move on!');
        }
       // await new Promise(resolve => setTimeout(resolve, 2000));
        cur = cur + 1;
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
