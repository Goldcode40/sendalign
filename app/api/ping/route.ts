import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('PING GET OK', { status: 200 });
}

export async function POST() {
  return new NextResponse('PING POST OK', { status: 200 });
}
