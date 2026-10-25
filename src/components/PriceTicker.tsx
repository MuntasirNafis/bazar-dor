"use client";

import { useEffect, useState } from "react";
import { formatPrice, getUnitBn, type Product } from "@/lib/utils";

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://api.api-store.workers.dev/api/bazardor/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch ticker data", err);
      }
    }
    fetchProducts();
  }, []);

  if (!products.length) return null;

  const tickerItems = [...products, ...products];

  return (
    <div className="bg-emerald-950 text-white py-2 overflow-hidden border-b border-emerald-900 text-sm">
      <div className="animate-marquee gap-8 items-center">
        {tickerItems.map((item, index) => {
          const isUp = item.change.dir === "up";
          const isDown = item.change.dir === "down";
          
          return (
            <div key={`${item.id}-${index}`} className="flex items-center gap-2 shrink-0">
              <span>{item.image}</span>
              <span className="font-medium">{item.nameBn}</span>
              <span className="text-emerald-300">
                {formatPrice(item.today)} টাকা/{getUnitBn(item.unit)}
              </span>
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  isUp
                    ? "bg-red-500/20 text-red-400"
                    : isDown
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-gray-500/20 text-gray-300"
                }`}
              >
                {isUp && `▲ ${item.change.pct}%`}
                {isDown && `▼ ${Math.abs(item.change.pct)}%`}
                {!isUp && !isDown && `— ০.০%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}