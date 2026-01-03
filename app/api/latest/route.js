import { NextResponse } from 'next/server';
import SakuraNovel from '@/lib/sakura-novel';

const scraper = new SakuraNovel();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    
    const latestUpdates = await scraper.getLatestUpdates(page);
    return NextResponse.json(latestUpdates);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}