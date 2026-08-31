import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';

export async function GET() {
  try {
    await connectMongo();
    let products = await Product.find({});
    
    // Auto-create initial product if DB is empty
    if (products.length === 0) {
      const sample = await Product.create({
        title: "Pure Chanderi Silk Fabric",
        slug: "pure-chanderi-silk",
        category: "Silk",
        fabricAttributes: {
          material: "Chanderi Silk",
          gsm: 120,
          widthInches: 44
        },
        pricePerMeter: 450,
        stockMeters: 1200
      });
      products = [sample];
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}