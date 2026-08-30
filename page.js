"use client";

import React, { useState } from "react";
import { ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import productsData from "@/data/products.json";

export default function Home() {
  const [mode, setMode] = useState("b2c"); // 'b2c' या 'b2b'
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({ name: "", gstin: "" });

  // प्रोडक्ट को कार्ट में जोड़ना
  const addToCart = (product, selectedSize, selectedMeters) => {
    const isStitched = product.category === "stitched";
    const qty = isStitched
      ? mode === "b2b"
        ? product.moqB2B
        : 1
      : selectedMeters;

    const price =
      mode === "b2b"
        ? product.priceB2B || product.pricePerMeterB2B
        : product.priceB2C || product.pricePerMeterB2C;

    const cartItem = {
      ...product,
      cartId: `${product.id}-${selectedSize || "meter"}-${Date.now()}`,
      selectedSize: isStitched ? selectedSize : null,
      selectedMeters: !isStitched ? selectedMeters : null,
      qty,
      unitPrice: price,
      totalPrice: price * qty,
    };

    setCart((prev) => [...prev, cartItem]);
    setIsCartOpen(true);
  };

  // कार्ट से प्रोडक्ट हटाना
  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // कुल राशि की गणना
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // व्हाट्सएप ऑर्डर लिंक बनाना
  const generateWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = `*नवीन क्रयादेशः / New Order - Jigyasafabrics.in*\n`;
    text += `*Mode:* ${mode.toUpperCase()}\n\n`;

    if (mode === "b2b") {
      text += `*Business Details:*\n`;
      text += `• Buyer/Business Name: ${businessInfo.name || "N/A"}\n`;
      text += `• GSTIN: ${businessInfo.gstin || "N/A"}\n\n`;
    }

    text += `*Order Items:*\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.name}*\n`;
      if (item.selectedSize) text += `   - Size: ${item.selectedSize}\n`;
      if (item.selectedMeters) text += `   - Length: ${item.selectedMeters} Meters\n`;
      text += `   - Quantity: ${item.qty} x ₹${item.unitPrice} = ₹${item.totalPrice}\n`;
    });

    text += `\n*Total Payable Amount:* ₹${cartTotal}`;

    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAFAFA] border-b border-[#D4AF37]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wide text-[#800020] font-serif">
              {siteConfig.name}
            </span>
            <span className="text-xs bg-[#D4AF37]/20 text-[#800020] px-2 py-0.5 rounded font-medium">
              Jaipur
            </span>
          </div>

          {/* B2B / B2C Dual Switcher */}
          <div className="flex items-center bg-gray-200 p-1 rounded-full border border-gray-300">
            <button
              onClick={() => setMode("b2c")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mode === "b2c"
                  ? "bg-[#800020] text-white shadow"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              Retail (B2C)
            </button>
            <button
              onClick={() => setMode("b2b")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mode === "b2b"
                  ? "bg-[#D4AF37] text-black shadow"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              Wholesale (B2B)
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#800020] hover:opacity-80"
          >
            <ShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#800020] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-[#800020] text-white py-10 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#D4AF37] mb-2">
          Authentic Sanganeri Block Prints
        </h1>
        <p className="text-xs md:text-sm max-w-xl mx-auto text-gray-200">
          Directly from Jaipur Craftsmen. Available for both Retail Buyers and Bulk Wholesale Orders.
        </p>
      </section>

      {/* Product List */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData.map((product) => (
            <ProductCardItem
              key={product.id}
              product={product}
              mode={mode}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-[#800020] font-serif">
                  Your Shopping Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    Your cart is empty.
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="flex justify-between items-center border-b pb-3 text-sm"
                    >
                      <div>
                        <p className="font-bold text-[#800020]">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.selectedSize
                            ? `Size: ${item.selectedSize}`
                            : `Length: ${item.selectedMeters} Meters`}{" "}
                          | Qty: {item.qty}
                        </p>
                        <p className="text-xs font-semibold text-gray-800">
                          ₹{item.unitPrice} x {item.qty} = ₹{item.totalPrice}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-500 p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4">
                {mode === "b2b" && (
                  <div className="mb-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Business / Buyer Name"
                      value={businessInfo.name}
                      onChange={(e) =>
                        setBusinessInfo({ ...businessInfo, name: e.target.value })
                      }
                      className="w-full border p-2 text-xs rounded"
                    />
                    <input
                      type="text"
                      placeholder="GSTIN (Optional)"
                      value={businessInfo.gstin}
                      onChange={(e) =>
                        setBusinessInfo({ ...businessInfo, gstin: e.target.value })
                      }
                      className="w-full border p-2 text-xs rounded"
                    />
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold mb-4 text-[#800020]">
                  <span>Total Amount:</span>
                  <span>₹{cartTotal}</span>
                </div>

                <button
                  onClick={generateWhatsAppOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded text-center text-sm transition"
                >
                  Order via WhatsApp 📲
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs border-t border-[#D4AF37]/30">
        <p>© 2026 Jigyasafabrics.in - Hand-Block Specialist, Jaipur, Rajasthan</p>
      </footer>
    </div>
  );
}

// प्रोडक्ट कार्ड सब-कंपोनेंट
function ProductCardItem({ product, mode, onAddToCart }) {
  const isB2B = mode === "b2b";
  const isStitched = product.category === "stitched";

  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : "M"
  );
  const [meters, setMeters] = useState(
    isB2B ? product.moqB2B : product.minMetersB2C || 2
  );

  const price = isB2B
    ? product.priceB2B || product.pricePerMeterB2B
    : product.priceB2C || product.pricePerMeterB2C;

  return (
    <div className="bg-white rounded-lg shadow border border-[#D4AF37]/20 overflow-hidden flex flex-col justify-between">
      <div>
        <div className="h-56 bg-gray-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 left-2 bg-[#800020] text-white text-[10px] px-2 py-0.5 rounded uppercase font-semibold">
            {product.category}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-serif font-bold text-[#800020] text-base leading-snug">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-gray-900 mt-2">
            ₹{price}{" "}
            <span className="text-xs font-normal text-gray-500">
              {isStitched ? "/ piece" : "/ meter"}
            </span>
          </p>

          {isB2B && (
            <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
              <strong>MOQ:</strong> {product.moqB2B}{" "}
              {isStitched ? "pieces" : "meters"} min. order
            </div>
          )}

          {isStitched && product.sizes && (
            <div className="mt-3">
              <label className="text-xs font-semibold block mb-1">
                Select Size:
              </label>
              <div className="flex gap-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2 py-1 text-xs border rounded ${
                      selectedSize === size
                        ? "bg-[#800020] text-white border-[#800020]"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isStitched && (
            <div className="mt-3">
              <label className="text-xs font-semibold block mb-1">
                Select Meters (Min {isB2B ? product.moqB2B : product.minMetersB2C || 2}m):
              </label>
              <input
                type="number"
                min={isB2B ? product.moqB2B : product.minMetersB2C || 2}
                value={meters}
                onChange={(e) =>
                  setMeters(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full border border-gray-300 rounded p-1 text-xs"
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToCart(product, selectedSize, meters)}
          className="w-full bg-[#800020] hover:bg-[#600018] text-white py-2 rounded flex items-center justify-center space-x-2 text-xs font-bold transition"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}