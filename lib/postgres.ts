import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initPostgres = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      product_id VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      meters NUMERIC NOT NULL,
      total_price NUMERIC NOT NULL,
      customer_name VARCHAR(255),
      customer_phone VARCHAR(50),
      payment_status VARCHAR(50) DEFAULT 'PENDING',
      razorpay_order_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
  console.log('[PostgreSQL] Orders table initialized');
};