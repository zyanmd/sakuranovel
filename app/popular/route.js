import { NextResponse } from 'next/server';
import SakuraNovel from '@/lib/sakura-novel';

const scraper = new SakuraNovel();

export async function GET(request) {
  try {
    const popularNovels = await scraper.getPopularNovels();
    return NextResponse.json(popularNovels);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}