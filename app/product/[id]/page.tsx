'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  category: string;
  pricePerMeter: number;
  stockMeters: number;
  fabricAttributes?: {
    material?: string;
    gsm?: number;
    widthInches?: number;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [meters, setMeters] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) return;
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.data.find((p: Product) => p._id === productId);
          setProduct(found || null);
        }
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [productId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-[#2874f0]">लोड हो रहा है...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">उत्पाद न प्राप्तम् (Product Not Found)</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.title,
      pricePerMeter: product.pricePerMeter,
      meters: meters,
      category: product.category,
    });
    alert(`${product.title} (${meters}M) कार्ट में जोड़ा गया!`);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-gray-800">
      {/* Header */}
      <header className="bg-[#2874f0] text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold italic">JigyasaFabrics</Link>
          <Link href="/cart" className="bg-white text-[#2874f0] px-4 py-1 rounded font-bold text-sm">
            Go to Cart 🛒
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto my-6 p-4 bg-white shadow-sm rounded-sm flex flex-col md:flex-row gap-8">
        {/* Left Side: Product Image & Buttons */}
        <div className="w-full md:w-2/5 flex flex-col items-center">
          <div className="w-full h-80 bg-gray-100 rounded-sm flex items-center justify-center text-8xl border">
            🧵
          </div>
          <div className="flex gap-4 w-full mt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#ff9f00] text-white py-3 rounded-sm font-bold text-sm hover:bg-[#e08c00] transition shadow"
            >
              ADD TO CART
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                window.location.href = '/cart';
              }}
              className="flex-1 bg-[#fb641b] text-white py-3 rounded-sm font-bold text-sm hover:bg-[#e65a16] transition shadow"
            >
              BUY NOW
            </button>
          </div>
        </div>

        {/* Right Side: Details & Ratings */}
        <div className="w-full md:w-3/5">
          <span className="text-xs bg-indigo-100 text-[#2874f0] font-bold px-2 py-0.5 rounded">
            {product.category}
          </span>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">{product.title}</h1>

          {/* Flipkart Ratings Badge */}
          <div className="flex items-center gap-2 my-2">
            <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              4.5 ★
            </span>
            <span className="text-xs text-gray-500 font-bold">1,240 Ratings & 180 Reviews</span>
          </div>

          {/* Price */}
          <div className="my-4 border-t border-b py-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.pricePerMeter * meters}</span>
              <span className="text-sm text-gray-500 line-through">₹{(product.pricePerMeter + 200) * meters}</span>
              <span className="text-xs text-green-700 font-bold">Special Price (विशेष मूल्य)</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">दर: ₹{product.pricePerMeter} प्रति मीटर</p>
          </div>

          {/* Meter Selector */}
          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">मात्रा (Meters):</label>
            <input
              type="number"
              min="1"
              max={product.stockMeters}
              value={meters}
              onChange={(e) => setMeters(Math.max(1, Number(e.target.value)))}
              className="w-20 p-1.5 border rounded text-center font-bold text-gray-900"
            />
          </div>

          {/* Specifications */}
          <div className="mt-6 border p-4 rounded-sm bg-gray-50">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Specifications (विशेषताएं)</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><strong className="text-gray-600">Material:</strong> {product.fabricAttributes?.material || 'N/A'}</div>
              <div><strong className="text-gray-600">GSM:</strong> {product.fabricAttributes?.gsm || 'N/A'}</div>
              <div><strong className="text-gray-600">Width:</strong> {product.fabricAttributes?.widthInches}" Inches</div>
              <div><strong className="text-gray-600">Available Stock:</strong> {product.stockMeters} Meters</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}