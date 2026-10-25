"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, getUnitBn, type Product } from "@/lib/utils";

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const res = await fetch("https://api.api-store.workers.dev/api/bazardor/products");
        if (res.ok) {
          const products: Product[] = await res.json();
          const found = products.find((p) => p.slug === slug);
          if (found) setProduct(found);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProductDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-2xl font-bold">পণ্যটি পাওয়া যায়নি!</h2>
        <Link href="/" className="btn btn-emerald bg-emerald-600 text-white">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs">
        <ul>
          <li><Link href="/">হোম</Link></li>
          <li><span className="text-emerald-700">{product.nameBn}</span></li>
        </ul>
      </div>

      {/* Main Info Card */}
      <div className="card bg-base-100 border border-base-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-6xl p-4 bg-base-200 rounded-2xl">{product.image}</span>
            <div>
              <span className="badge badge-outline text-emerald-700 border-emerald-300 mb-2">
                {product.categoryNameBn}
              </span>
              <h1 className="text-3xl font-extrabold">{product.nameBn}</h1>
              <p className="text-sm text-base-content/60 mt-1">একক: {getUnitBn(product.unit)}</p>
            </div>
          </div>

          <div className="text-left md:text-right bg-emerald-50 p-4 rounded-xl border border-emerald-100 w-full md:w-auto">
            <div className="text-sm text-emerald-800 font-medium">আজকের বাজার দর</div>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1">
              {formatPrice(product.today)} <span className="text-base font-normal">টাকা</span>
            </div>
            <div className="text-xs mt-1 flex items-center md:justify-end gap-1">
              <span className="text-base-content/60">পরিবর্তন:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded ${
                  isUp ? "text-red-600 bg-red-100" : isDown ? "text-emerald-600 bg-emerald-100" : "text-gray-600 bg-gray-100"
                }`}
              >
                {isUp && `▲ ${product.change.pct}%`}
                {isDown && `▼ ${Math.abs(product.change.pct)}%`}
                {!isUp && !isDown && `— ০.০%`}
              </span>
            </div>
          </div>
        </div>

        {/* Historical Price Comparisons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-base-200 text-center">
          <div className="bg-base-200/60 p-4 rounded-xl">
            <div className="text-xs text-base-content/60">গতকাল</div>
            <div className="text-xl font-bold mt-1">{formatPrice(product.yesterday)} টাকা</div>
          </div>
          <div className="bg-base-200/60 p-4 rounded-xl">
            <div className="text-xs text-base-content/60">গত সপ্তাহ</div>
            <div className="text-xl font-bold mt-1">{formatPrice(product.lastWeek)} টাকা</div>
          </div>
          <div className="bg-base-200/60 p-4 rounded-xl">
            <div className="text-xs text-base-content/60">গত মাস</div>
            <div className="text-xl font-bold mt-1">{formatPrice(product.lastMonth)} টাকা</div>
          </div>
        </div>
      </div>

      {/* Regional / Market Wise Prices */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">বিভিন্ন বাজারের দর তুলনা</h3>
        <div className="overflow-x-auto bg-base-100 border border-base-200 rounded-xl shadow-sm">
          <table className="table">
            <thead>
              <tr className="bg-base-200 text-base-content">
                <th>বাজারের নাম</th>
                <th>বিভাগ</th>
                <th>সর্বনিম্ন দাম</th>
                <th>সর্বোচ্চ দাম</th>
              </tr>
            </thead>
            <tbody>
              {product.markets?.map((m, idx) => (
                <tr key={idx} className="hover">
                  <td className="font-semibold">{m.market}</td>
                  <td>{m.division}</td>
                  <td className="text-emerald-700 font-bold">{formatPrice(m.min)} টাকা</td>
                  <td className="text-error font-bold">{formatPrice(m.max)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}