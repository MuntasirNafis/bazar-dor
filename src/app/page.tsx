"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBanglaDate, formatPrice, type Product } from "@/lib/utils";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    setBanglaDate(getBanglaDate());

    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  const risers = products.filter((p) => p.change?.dir === "up").slice(0, 6);
  const fallers = products.filter((p) => p.change?.dir === "down").slice(0, 6);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Hero Section with bazar-hero.png */}
      <section className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
        <div className="max-w-xl space-y-4">
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3.5 py-1.5 rounded-full">
            {banglaDate || "আজকের বাজার"}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            আজকের বাজারের সঠিক দাম এক নজরে
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <div className="pt-2">
            <a href="#all-products" className="inline-block bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition shadow-sm">
              সব পণ্য দেখুন
            </a>
          </div>
        </div>
        <div className="w-64 md:w-80 flex-shrink-0 flex justify-center">
          <Image 
            src="/bazar-hero.png" 
            alt="Bazar Hero" 
            width={320} 
            height={320} 
            className="w-full h-auto object-contain drop-shadow-md" 
            priority 
          />
        </div>
      </section>

      {/* Price Up Section */}
      {risers.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <span>▲</span> আজ দাম বেড়েছে
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {risers.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Price Down Section */}
      {fallers.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
            <span>▼</span> আজ দাম কমেছে
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallers.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      <div className="divider my-8"></div>

      {/* All Products Section */}
      <section id="all-products" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">সব পণ্য</h3>
          <span className="text-sm text-gray-500 font-medium">মোট {products.length}টি পণ্য দেখানো হচ্ছে</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';

  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
    >
      <div>
        <div className="text-4xl mb-3">{product.image}</div>
        <h4 className="text-lg font-bold text-gray-800">{product.nameBn}</h4>
        <p className="text-xs text-gray-500 mt-0.5">প্রতি {product.unit}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-end">
        <div>
          <span className="text-xs text-gray-400 block">আজকের দাম</span>
          <span className="text-xl font-extrabold text-emerald-700">{formatPrice(product.today)} টাকা</span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isUp ? 'text-red-600 bg-red-50' : isDown ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 bg-gray-100'}`}>
          {isUp ? `▲ ${product.change?.pct}%` : isDown ? `▼ ${Math.abs(product.change?.pct || 0)}%` : `— ${product.change?.pct || 0}%`}
        </span>
      </div>
    </Link>
  );
}