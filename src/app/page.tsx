"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, getUnitBn, type Product, type Category } from "@/lib/utils";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("https://api.api-store.workers.dev/api/bazardor/products"),
          fetch("https://api.api-store.workers.dev/api/bazardor/categories"),
        ]);
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.categoryNameBn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.today - b.today;
    if (sortBy === "price-high") return b.today - a.today;
    if (sortBy === "name") return a.nameBn.localeCompare(b.nameBn);
    return 0;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              আজকের বাজারের সঠিক দাম এক নজরে
            </h1>
            <p className="text-emerald-100 text-base md:text-lg">
              চাল, ডাল, তেল থেকে শুরু করে সকল নিত্যপ্রয়োজনীয় পণ্যের পাইকারি ও খুচরা দর যাচাই করুন সহজেই।
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl w-full md:w-auto text-center">
            <div className="text-2xl font-bold">🛒 রিয়েল-টাইম আপডেট</div>
            <div className="text-sm text-emerald-200 mt-1">প্রতিদিনের বাজারদরের নির্ভরযোগ্য উৎস</div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search, Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-base-200 p-4 rounded-xl shadow-sm">
          {/* Search Bar */}
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="পণ্যের নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full bg-base-100"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered bg-base-100"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.icon} {cat.nameBn}
                </option>
              ))}
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered bg-base-100"
            >
              <option value="default">সাজান (ডিফলต์)</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
              <option value="name">নাম অনুযায়ী (ক-ক্ষ)</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-base-200 rounded-xl">
            <h3 className="text-xl font-bold text-base-content/70">দুঃখিত, কোনো পণ্য পাওয়া যায়নি!</h3>
            <p className="text-sm text-base-content/50 mt-1">অন্য নাম দিয়ে খুঁজে দেখতে পারেন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => {
              const isUp = item.change.dir === "up";
              const isDown = item.change.dir === "down";

              return (
                <div key={item.id} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body p-5">
                    <div className="flex justify-between items-start">
                      <span className="text-3xl">{item.image}</span>
                      <span className="badge badge-outline text-xs text-emerald-700 border-emerald-300">
                        {item.categoryNameBn}
                      </span>
                    </div>

                    <h2 className="card-title text-lg font-bold mt-2">{item.nameBn}</h2>

                    <div className="mt-2 space-y-1">
                      <div className="text-2xl font-extrabold text-emerald-700">
                        {formatPrice(item.today)} <span className="text-sm font-normal text-base-content/70">টাকা / {getUnitBn(item.unit)}</span>
                      </div>
                      <div className="text-xs text-base-content/60 flex items-center gap-2">
                        <span>গতকাল: {formatPrice(item.yesterday)} টাকা</span>
                        <span
                          className={`font-semibold px-1 rounded ${
                            isUp ? "text-red-600 bg-red-50" : isDown ? "text-emerald-600 bg-emerald-50" : "text-gray-600 bg-gray-50"
                          }`}
                        >
                          {isUp && `▲ ${item.change.pct}%`}
                          {isDown && `▼ ${Math.abs(item.change.pct)}%`}
                          {!isUp && !isDown && `— ০.০%`}
                        </span>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4 pt-3 border-t border-base-200">
                      <Link href={`/product/${item.slug}`} className="btn btn-emerald bg-emerald-600 hover:bg-emerald-700 text-white btn-sm w-full">
                        বিস্তারিত ও বাজার মূল্য দেখুন
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}