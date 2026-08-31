import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Auto Create Table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(255),
        product_name VARCHAR(255),
        meters INT,
        total_price NUMERIC,
        payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const result = await client.query('SELECT * FROM orders ORDER BY id DESC');
    client.release();

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Database Error in GET /api/orders:', error);
    // Return empty array instead of crashing with 500 error
    return NextResponse.json(
      { success: false, data: [], error: error.message },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, productName, meters, totalPrice, paymentId } = body;

    const client = await pool.connect();

    await client.query(
      `INSERT INTO orders (product_id, product_name, meters, total_price, payment_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [productId, productName, meters, totalPrice, paymentId]
    );

    client.release();
    return NextResponse.json({ success: true, message: 'Order saved successfully' });
  } catch (error: any) {
    console.error('Database Error in POST /api/orders:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}