"use client";
import React from "react";
import { ShoppingBag } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Navbar({ mode, setMode, cartCount, openCart }) {
  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFA] border-b border-[#D4AF37]/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-wide text-[#800020] font-serif">
            {siteConfig.name}
          </span>
          <span className="text-xs bg-[#D4AF37]/20 text-[#800020] px-2 py-0.5 rounded font-medium">
            Jaipur
          </span>
        </div>

        {/* B2B / B2C Dual Mode Toggle */}
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

        <div className="flex items-center space-x-4">
          <button onClick={openCart} className="relative p-2 text-[#800020] hover:opacity-80">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#800020] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}