"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate, formatPrice, type Category, type Product } from "@/lib/utils";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickerData, setTickerData] = useState<Product[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [banglaDate, setBanglaDate] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBanglaDate(getBanglaDate());

    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => setTickerData(data))
      .catch((err) => console.error("Error fetching products:", err));

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/signin";
        },
      },
    });
  };

  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-icon.png" alt="Bazar Dor Logo" className="w-10 h-10 object-contain rounded-lg" />
          <div>
            <h1 className="font-extrabold text-xl text-emerald-800 tracking-tight leading-none">বাজার দর</h1>
            <p className="text-xs text-gray-500 mt-1">{banglaDate || "আজকের তারিখ"}</p>
          </div>
        </Link>

        {isPending ? (
          <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
        ) : user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-xs">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name?.charAt(0) || "U"
                )}
              </div>
              <span className="text-xs font-semibold text-gray-800 pr-1">{user.name}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-gray-400 truncate">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition"
                >
                  👤 আমার প্রোফাইল
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition border-t border-gray-50 mt-1 cursor-pointer"
                >
                  🚪 সাইন আউট
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/signin" className="px-4 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg transition border border-emerald-200">
              সাইন ইন
            </Link>
            <Link href="/signup" className="px-4 py-1.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-xs">
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

      {/* Category Links Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex gap-6 overflow-x-auto text-sm font-medium text-gray-700 border-t border-gray-100 scrollbar-none">
        <Link href="/" className="hover:text-emerald-600 whitespace-nowrap">
          হোম
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id || cat.slug} href={`/category/${cat.slug}`} className="hover:text-emerald-600 whitespace-nowrap flex items-center gap-1">
            <span>{cat.icon}</span> <span>{cat.nameBn}</span>
          </Link>
        ))}
      </nav>

      {/* Clean Single Line Price Ticker Bar */}
      {tickerData.length > 0 && (
        <div className="bg-white border-t border-b border-gray-200 py-2 overflow-hidden whitespace-nowrap flex">
          <div className="animate-marquee flex gap-8 text-xs items-center text-gray-700 font-medium">
            {tickerData.map((item, idx) => {
              const isUp = item.change?.dir === "up";
              const isDown = item.change?.dir === "down";
              return (
                <span key={idx} className="flex items-center gap-1.5 px-2">
                  <span>{item.image}</span>
                  <span>{item.nameBn}</span>
                  <span className="font-bold text-gray-900">{formatPrice(item.today)} টাকা/{item.unit}</span>
                  <span className={`font-semibold ${isUp ? "text-red-600" : isDown ? "text-emerald-600" : "text-gray-500"}`}>
                    {isUp && `▲ ${item.change.pct}%`}
                    {isDown && `▼ ${Math.abs(item.change.pct)}%`}
                    {!isUp && !isDown && `— ০.০%`}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}