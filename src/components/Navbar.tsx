"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate, type Category } from "@/lib/utils";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [banglaDate, setBanglaDate] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBanglaDate(getBanglaDate());

    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

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
              className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full transition cursor-pointer shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold uppercase">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name?.charAt(0) || "U"
                )}
              </div>
              <span className="text-xs font-semibold text-gray-800">{user.name}</span>
              <span className="text-xs text-gray-400">▼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                  <p className="text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition"
                >
                  <span>👤</span> আমার প্রফাইল
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium transition border-t border-gray-100 mt-1 cursor-pointer"
                >
                  <span>🚪</span> সাইন আউট
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
    </header>
  );
}