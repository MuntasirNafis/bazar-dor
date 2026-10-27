"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { formatPrice, type Product } from "@/lib/utils";

function ProductDetailsContent() {
  const params = useParams();
  const slug = params?.slug;
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BetterAuth check: Redirect if unauthenticated
    if (!isPending && !session?.user) {
      router.push(`/signin?callbackUrl=/product/${slug}`);
      return;
    }

    if (!slug) return;

    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.slug === slug || String(p.id) === String(slug));
        setProduct(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setLoading(false);
      });
  }, [slug, session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">পণ্যটি পাওয়া যায়নি</h2>
        <Link href="/" className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const marketPrices = product.markets?.map((m) => m.min) || [product.today || 0];
  const minPrice = Math.min(...marketPrices);
  const maxPrice = Math.max(...(product.markets?.map((m) => m.max) || [product.today || 0]));
  const isUp = product.change?.dir === "up";

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <div className="text-4xl mb-2">{product.image}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.nameBn}</h2>
          <p className="text-xs text-gray-500 mb-3">একক: {product.unit}</p>
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">
            {product.categoryNameBn || "ক্যাটাগরি"}
          </span>
        </div>
        <div className="text-right bg-emerald-50 border border-emerald-100 p-4 rounded-xl w-full md:w-auto">
          <span className="text-xs text-gray-500 block">আজকের গড় দাম</span>
          <span className="text-2xl font-bold text-emerald-700">{formatPrice(product.today)} টাকা</span>
          <span className={`text-xs block mt-1 font-medium ${isUp ? 'text-red-600' : 'text-emerald-600'}`}>
            {isUp ? `▲ ${product.change?.pct}%` : `▼ ${Math.abs(product.change?.pct || 0)}%`}
          </span>
        </div>
      </div>

      {/* PRICE SUMMARY SECTION */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-gray-900 mb-3">দামের সারসংক্ষেপ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
            <span className="text-xs text-gray-500 block mb-1">সর্বনিম্ন দাম</span>
            <span className="text-xl font-bold text-emerald-600">{formatPrice(minPrice)} টাকা</span>
            <p className="text-[11px] text-gray-400 mt-1">সবচেয়ে কম দামের বাজার</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
            <span className="text-xs text-gray-500 block mb-1">সর্বাধিক দাম</span>
            <span className="text-xl font-bold text-red-600">{formatPrice(maxPrice)} টাকা</span>
            <p className="text-[11px] text-gray-400 mt-1">সবচেয়ে বেশি দামের বাজার</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
            <span className="text-xs text-gray-500 block mb-1">গড় দাম</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(product.today)} টাকা</span>
            <p className="text-[11px] text-gray-400 mt-1">একক অনুযায়ী</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">
          বাজারভিত্তিক আজকের দাম
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-3">বাজার</th>
                <th className="p-3">বিভাগ</th>
                <th className="p-3">সর্বনিম্ন</th>
                <th className="p-3">সর্বোচ্চ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {product.markets?.map((m: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{m.market}</td>
                  <td className="p-3 text-gray-500">{m.division}</td>
                  <td className="p-3 text-emerald-700 font-semibold">{formatPrice(m.min)} টাকা</td>
                  <td className="p-3 text-red-600 font-semibold">{formatPrice(m.max)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-20"><span className="loading loading-spinner text-emerald-600"></span></div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}