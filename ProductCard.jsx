"use client";
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, mode, onAddToCart }) {
  const isB2B = mode === "b2b";
  const isStitched = product.category === "stitched";

  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [meters, setMeters] = useState(isB2B ? product.moqB2B : (product.minMetersB2C || 2));

  const price = isB2B
    ? (product.priceB2B || product.pricePerMeterB2B)
    : (product.priceB2C || product.pricePerMeterB2C);

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize: isStitched ? selectedSize : null,
      selectedMeters: !isStitched ? meters : null,
      selectedQty: isStitched ? (isB2B ? product.moqB2B : 1) : meters,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-[#D4AF37]/20 overflow-hidden flex flex-col justify-between">
      <div>
        <div className="h-64 bg-gray-100 relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <span className="absolute top-2 left-2 bg-[#800020] text-white text-[10px] px-2 py-1 rounded tracking-wide uppercase">
            {product.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-serif font-bold text-[#800020] text-lg leading-snug">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs mt-1 line-clamp-2">{product.description}</p>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-[#800020]">₹{price}</span>
            <span className="text-xs text-gray-500">
              {isStitched ? "/ piece" : "/ meter"}
            </span>
          </div>

          {isB2B && (
            <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
              <strong>B2B MOQ:</strong> {product.moqB2B} {isStitched ? "sets" : "meters"} min. order
            </div>
          )}

          {isStitched && product.sizes && (
            <div className="mt-3">
              <label className="text-xs font-semibold text-gray-700 block mb-1">Select Size:</label>
              <div className="flex gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2 py-1 text-xs border rounded ${
                      selectedSize === s
                        ? "border-[#800020] bg-[#800020] text-white"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isStitched && (
            <div className="mt-3">
              <label className="text-xs font-semibold text-gray-700 block mb-1">Meters Required:</label>
              <input
                type="number"
                min={isB2B ? product.moqB2B : (product.minMetersB2C || 2)}
                value={meters}
                onChange={(e) => setMeters(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#800020] hover:bg-[#600018] text-white py-2 rounded flex items-center justify-center space-x-2 text-sm font-semibold transition"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isB2B ? "Add to Wholesale Cart" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}