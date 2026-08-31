'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'ADD_PRODUCT'>('ORDERS');

  // Form state for adding new fabric
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [material, setMaterial] = useState('');

  useEffect(() => {
    fetch('/api/orders').then((res) => res.json()).then((data) => setOrders(data.data || []));
    fetch('/api/products').then((res) => res.json()).then((data) => setProducts(data.data || []));
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          pricePerMeter: Number(price),
          stockMeters: Number(stock),
          fabricAttributes: { material, gsm: 180, widthInches: 44 },
        }),
      });

      if (res.ok) {
        alert('नया फैब्रिक सफलतापूर्वक जोड़ा गया!');
        setTitle(''); setCategory(''); setPrice(''); setStock(''); setMaterial('');
      }
    } catch (err) {
      alert('फैब्रिक जोड़ने में त्रुटि आई।');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-gray-800 flex flex-col">
      <header className="bg-[#172337] text-white p-4 font-bold flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl italic text-[#ffe11b]">Flipkart Admin</Link>
          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">Dashboard</span>
        </div>
        <Link href="/" className="text-xs bg-[#2874f0] px-3 py-1 rounded">View Store</Link>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 flex flex-col md:flex-row gap-4">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white p-4 shadow-sm rounded-sm self-start">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`w-full text-left p-2 text-xs font-bold rounded ${activeTab === 'ORDERS' ? 'bg-[#2874f0] text-white' : 'hover:bg-gray-100'}`}
            >
              📦 Total Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('ADD_PRODUCT')}
              className={`w-full text-left p-2 text-xs font-bold rounded ${activeTab === 'ADD_PRODUCT' ? 'bg-[#2874f0] text-white' : 'hover:bg-gray-100'}`}
            >
              ➕ Add New Product
            </button>
          </div>
        </aside>

        {/* Dynamic Section Content */}
        <main className="flex-1 bg-white p-6 shadow-sm rounded-sm">
          {activeTab === 'ORDERS' ? (
            <div>
              <h2 className="text-base font-bold mb-4 border-b pb-2">All Customer Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-2">Order ID / Payment ID</th>
                      <th className="p-2">Product Name</th>
                      <th className="p-2">Meters</th>
                      <th className="p-2">Total Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-gray-600">{o.paymentId}</td>
                        <td className="p-2 font-bold">{o.productName}</td>
                        <td className="p-2">{o.meters} M</td>
                        <td className="p-2 font-bold text-green-700">₹{o.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-base font-bold mb-4 border-b pb-2">Add New Fabric Product</h2>
              <form onSubmit={handleAddProduct} className="max-w-md space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Product Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
                </div>
                <div>
                  <label className="block font-bold mb-1">Category (e.g. Cotton, Silk)</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded" required />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block font-bold mb-1">Price Per Meter (₹)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded" required />
                  </div>
                  <div className="flex-1">
                    <label className="block font-bold mb-1">Stock (Meters)</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border p-2 rounded" required />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">Material Name</label>
                  <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full border p-2 rounded" required />
                </div>
                <button type="submit" className="bg-[#fb641b] text-white px-6 py-2.5 rounded font-bold text-xs uppercase shadow">
                  Publish Product
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}