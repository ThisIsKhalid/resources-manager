import { NextRequest, NextResponse } from 'next/server';
import { getHtmlContent } from '@/lib/resources';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return new NextResponse('Bad Request: Missing slug', { status: 400 });
  }

  const content = getHtmlContent(slug);

  if (!content) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Serve with HTML content type so the iframe correctly parses and renders it
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Allow it to be embedded in iframes on the same origin
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}
