'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalAmount } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    const paymentId = 'pay_cart_' + Math.random().toString(36).substring(2, 10);

    try {
      for (const item of cart) {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.id,
            productName: item.title,
            meters: item.meters,
            totalPrice: item.pricePerMeter * item.meters,
            paymentId: paymentId,
          }),
        });
      }
      alert('ऑर्डर सफलतापूर्वक डेटाबेस में सहेजा गया! (Order Placed Successfully!)');
      clearCart();
    } catch (err) {
      alert('ऑर्डर में त्रुटि आई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] p-4 text-gray-800">
      <header className="bg-[#2874f0] text-white p-4 font-bold flex justify-between max-w-5xl mx-auto rounded-sm">
        <Link href="/" className="text-xl italic">JigyasaFabrics</Link>
        <span>My Cart ({cart.length})</span>
      </header>

      <main className="max-w-5xl mx-auto mt-4 flex flex-col md:flex-row gap-4">
        {/* Cart Items */}
        <div className="flex-1 bg-white p-4 shadow-sm rounded-sm">
          <h2 className="text-lg font-bold border-b pb-2 mb-4">Shopping Cart</h2>
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">आपकी कार्ट खाली है! (Your Cart is Empty)</p>
              <Link href="/" className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-bold text-sm">
                Shop Now
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b py-3">
                <div>
                  <h3 className="font-semibold text-base">{item.title}</h3>
                  <p className="text-xs text-gray-500">मात्रा: {item.meters} Meters</p>
                  <p className="text-sm font-bold mt-1">₹{item.pricePerMeter * item.meters}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-xs"
                >
                  REMOVE
                </button>
              </div>
            ))
          )}
        </div>

        {/* Price Details */}
        {cart.length > 0 && (
          <div className="w-full md:w-80 bg-white p-4 shadow-sm rounded-sm self-start">
            <h3 className="font-bold text-gray-500 text-xs border-b pb-2 uppercase">PRICE DETAILS</h3>
            <div className="my-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price ({cart.length} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Delivery Charges</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-3 font-bold text-sm rounded-sm shadow hover:bg-[#e65a16] transition"
            >
              {loading ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}