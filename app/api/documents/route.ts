import { NextResponse } from 'next/server';
import { DataAPIClient } from '@datastax/astra-db-ts';
import { getLoggedInUserEmailPrefix } from '@/lib/documents/helpers';

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_ENDPOINT);

export async function GET(request: Request) {

  const emailPrefix = await getLoggedInUserEmailPrefix();

  try {

    // Fetch all collections (tables) in the keyspace
    const collectionInfo = await db.listCollections();

    const collections = collectionInfo
      .filter((collection) => collection.name.startsWith("documents"+emailPrefix))
      .map((collection) => ({
        name: collection,
        prefixMatched: true,
      }));

    return NextResponse.json({ collections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
  }
}
