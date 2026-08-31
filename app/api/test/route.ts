import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: "SUCCESS", message: "API is working properly!" });
}