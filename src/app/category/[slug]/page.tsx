"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/utils";

function CategoryContent() {
  const params = useParams();
  const slug = params?.slug;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    if (!slug) return;
    fetch(`https://api.api-store.workers.dev/api/bazardor/products?category=${slug}`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        // Filter locally in case API returns all products
        const filtered = Array.isArray(data) ? data.filter((p) => p.category === slug) : [];
        setProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        setLoading(false);
      });
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-to-high") return a.today - b.today;
    if (sortOrder === "high-to-low") return b.today - a.today;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">কোনো পণ্য পাওয়া যায়নি</h2>
        <p className="text-gray-500 mb-6">এই ক্যাটাগরিতে বর্তমানে কোনো তথ্য নেই।</p>
        <Link href="/" className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-emerald-50 p-6 rounded-2xl gap-4 border border-emerald-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>{sortedProducts[0]?.image}</span>
            <span>{sortedProducts[0]?.categoryNameBn}</span>
          </h2>
          <p className="text-xs text-gray-600 mt-1">প্রতিদিনের বাজার দর এক নজরে</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
          <span className="text-xs text-gray-500 font-medium">সাজান:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-sm bg-transparent focus:outline-none cursor-pointer text-gray-700"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedProducts.map((product) => {
          const isUp = product.change?.dir === "up";
          const isDown = product.change?.dir === "down";

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-2">{product.image}</div>
                <h4 className="font-semibold text-gray-800">{product.nameBn}</h4>
                <p className="text-xs text-gray-500">একক: {product.unit}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 block">আজকের দাম</span>
                  <span className="font-bold text-gray-900">{formatPrice(product.today)} টাকা</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${isUp ? 'text-red-600 bg-red-50' : isDown ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 bg-gray-100'}`}>
                  {isUp ? `▲ ${product.change?.pct}%` : isDown ? `▼ ${Math.abs(product.change?.pct || 0)}%` : `— ${product.change?.pct || 0}%`}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-20"><span className="loading loading-spinner text-emerald-600"></span></div>}>
      <CategoryContent />
    </Suspense>
  );
}