import { connectReadOnlyDB } from '@/lib/readonlyDb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const collectionName = searchParams.get('collection');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const skip = (page - 1) * limit;
  const search = searchParams.get('search');
  const doAggregate = searchParams.get('aggregate') === 'true';

  let filters: Record<string, string[]> = {};
  try {
    const raw = searchParams.get('filters');
    if (raw) filters = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid filters format' }, { status: 400 });
  }

  if (!collectionName) {
    return NextResponse.json({ error: 'Missing collection name' }, { status: 400 });
  }

  try {
    const db = await connectReadOnlyDB();
    const collection = db.collection(collectionName);

    // Global search query
    const query: Record<string, any> = {};
    if (search) {
      const sample = await collection.findOne({});
      if (sample) {
        query['$or'] = Object.keys(sample)
          .filter((key) => typeof sample[key] === 'string')
          .map((key) => ({ [key]: { $regex: search, $options: 'i' } }));
      }
    }

    // Always get total count for pagination
    const totalCount = await collection.countDocuments(query);

    // Main data fetch
    const data = await collection.find(query).skip(skip).limit(limit).toArray();

    // Optional aggregate counts
    const aggregateCounts: Record<string, Record<string, number>> = {};

    if (doAggregate) {
      for (const field in filters) {
        aggregateCounts[field] = {};
        for (const value of filters[field]) {
          const count = await collection.countDocuments({
            ...query,
            [field]: value,
          });
          aggregateCounts[field][value] = count;
        }
      }
    }

    return NextResponse.json({
      data,
      totalCount,
      aggregateCounts,
    });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
