'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  product_name: string;
  meters: number;
  total_price: number;
  payment_id: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(async (res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setOrders(data.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch Error:', err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-gray-800">
      <header className="bg-[#2874f0] text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold italic">JigyasaFabrics</Link>
          <span className="font-semibold text-sm">My Orders</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto my-6 p-4">
        <h1 className="text-lg font-bold mb-4">My Orders ({orders.length})</h1>

        {loading ? (
          <div className="text-center py-10 font-bold text-[#2874f0]">ऑर्डर लोड हो रहे हैं...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-sm shadow-sm">
            <p className="text-gray-500 mb-4">कोई ऑर्डर नहीं मिला।</p>
            <Link href="/" className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-bold text-xs">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white p-4 rounded-sm shadow-sm border flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl border">🧵</div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{ord.product_name}</h3>
                    <p className="text-xs text-gray-500">Quantity: {ord.meters} Meters</p>
                    <p className="text-xs text-gray-400">Payment ID: {ord.payment_id}</p>
                  </div>
                </div>
                <span className="text-base font-bold text-gray-900">₹{ord.total_price}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}