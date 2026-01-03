import { NextResponse } from 'next/server';
import SakuraNovel from '@/lib/sakura-novel';

const scraper = new SakuraNovel();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }
    
    const detail = await scraper.detail(url);
    return NextResponse.json(detail);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}