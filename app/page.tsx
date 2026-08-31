'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMeters, setSelectedMeters] = useState<{ [key: string]: number }>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
          setFilteredProducts(data.data);
          const initialMeters: { [key: string]: number } = {};
          data.data.forEach((p: Product) => {
            initialMeters[p._id] = 1;
          });
          setSelectedMeters(initialMeters);
        }
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.fabricAttributes?.material?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    const meters = selectedMeters[product._id] || 1;
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
    <div className="min-h-screen bg-[#f1f3f6] text-gray-800 flex flex-col font-sans">
      <header className="bg-[#2874f0] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex flex-col cursor-pointer">
            <span className="text-xl font-bold italic tracking-wide">JigyasaFabrics</span>
            <span className="text-[11px] italic text-[#ffe11b] font-medium">Explore Plus</span>
          </Link>

          <div className="flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="फैब्रिक या उत्पाद खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 rounded-sm text-sm text-gray-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold">
            {user ? (
              <span className="bg-white text-[#2874f0] px-4 py-1 rounded-sm font-bold text-xs">
                👤 {user.name}
              </span>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-white text-[#2874f0] px-6 py-1 rounded-sm font-bold shadow-sm"
              >
                Login
              </button>
            )}

            <Link href="/orders" className="hover:text-gray-200 hidden md:inline">
              Orders
            </Link>

            <Link href="/admin" className="hover:text-gray-200 hidden md:inline text-xs bg-blue-700 px-2 py-1 rounded">
              Admin Panel
            </Link>

            <Link href="/cart" className="bg-white text-[#2874f0] px-4 py-1 rounded-sm font-bold flex items-center gap-2">
              🛒 <span className="bg-[#fb641b] text-white px-2 py-0.5 rounded-full text-xs">{cart.length}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full p-4 flex-1 flex gap-4">
        <aside className="w-64 bg-white p-4 shadow-sm border rounded-sm hidden md:block">
          <h2 className="text-lg font-bold border-b pb-2 mb-4">Filters</h2>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="cat"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                  className="accent-[#2874f0]"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-white p-4 shadow-sm border rounded-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((item) => {
              const meters = selectedMeters[item._id] || 1;
              return (
                <div key={item._id} className="border p-4 rounded-sm hover:shadow-lg transition flex flex-col justify-between group">
                  <Link href={`/product/${item._id}`}>
                    <div className="h-40 bg-gray-100 rounded-sm mb-3 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">🧵</div>
                    <span className="text-[10px] bg-blue-50 text-[#2874f0] font-bold px-2 py-0.5 rounded-sm">{item.category}</span>
                    <h2 className="font-semibold text-base text-gray-900 mt-1 hover:text-[#2874f0]">{item.title}</h2>
                    <p className="text-xs text-gray-500 my-1 font-bold">₹{item.pricePerMeter} / meter</p>
                  </Link>

                  <div>
                    <div className="flex justify-between items-center my-2 text-xs">
                      <span>Meters:</span>
                      <input
                        type="number"
                        min="1"
                        value={meters}
                        onChange={(e) =>
                          setSelectedMeters({ ...selectedMeters, [item._id]: Math.max(1, Number(e.target.value)) })
                        }
                        className="w-16 border rounded text-center"
                      />
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="w-full bg-[#ff9f00] hover:bg-[#e08c00] text-white py-2 rounded-sm text-xs font-bold"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={(u) => setUser(u)} />
    </div>
  );
}