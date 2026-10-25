"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, getUnitBn, type Product } from "@/lib/utils";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("https://api.api-store.workers.dev/api/bazardor/products"),
          fetch("https://api.api-store.workers.dev/api/bazardor/categories"),
        ]);

        if (catRes.ok) {
          const categories = await catRes.json();
          const currentCat = categories.find((c: any) => c.slug === slug);
          if (currentCat) setCategoryName(currentCat.nameBn);
        }

        if (prodRes.ok) {
          const allProducts: Product[] = await prodRes.json();
          const filtered = allProducts.filter((p) => p.category === slug);
          setProducts(filtered);
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchCategoryProducts();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white p-8 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">ক্যাটাগরি</span>
          <h1 className="text-3xl font-extrabold mt-1">{categoryName || "পণ্যের তালিকা"}</h1>
        </div>
        <Link href="/" className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-emerald-900">
          সকল পণ্য দেখুন
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-xl">
          <h3 className="text-xl font-bold text-base-content/70">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি!</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => {
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
                  </div>

                  <div className="card-actions justify-end mt-4 pt-3 border-t border-base-200">
                    <Link href={`/product/${item.slug}`} className="btn btn-emerald bg-emerald-600 hover:bg-emerald-700 text-white btn-sm w-full">
                      বিস্তারিত দেখুন
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}