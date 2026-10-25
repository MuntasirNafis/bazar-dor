"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate, type Category } from "@/lib/utils";

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://api.api-store.workers.dev/api/bazardor/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সাইন আউট সফল হয়েছে!");
          router.push("/");
        },
        onError: () => {
          toast.error("সাইন আউট ব্যর্থ হয়েছে");
        },
      },
    });
  };

  return (
    <header className="border-b border-base-200 bg-base-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-base-200">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
              🛒 বাজার দর
            </span>
            <span className="text-xs text-base-content/70">{getBanglaDate()}</span>
          </Link>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : session?.user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full ring ring-emerald-500 ring-offset-2">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name || "User"} />
                    ) : (
                      <span className="text-lg font-bold flex items-center justify-center h-full bg-emerald-100 text-emerald-800">
                        {session.user.name?.charAt(0) || "ইউ"}
                      </span>
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li className="px-4 py-2 font-semibold text-emerald-700 border-b border-base-200">
                    {session.user.name}
                  </li>
                  <li>
                    <Link href="/profile">মাই প্রোফাইল</Link>
                  </li>
                  <li>
                    <button onClick={handleSignOut} className="text-error">সাইন আউট</button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/signin" className="btn btn-outline btn-emerald btn-sm">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-emerald bg-emerald-600 text-white hover:bg-emerald-700 btn-sm">
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden btn btn-ghost btn-square"
            aria-label="Toggle Navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 py-2 overflow-x-auto">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "hover:bg-emerald-50 text-base-content"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-base-content/60 px-2 uppercase">ক্যাটাগরি</span>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-50"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-base-200">
              {session?.user ? (
                <div className="space-y-2">
                  <div className="px-2 text-sm font-semibold">{session.user.name}</div>
                  <Link href="/profile" className="btn btn-emerald btn-outline btn-sm w-full">
                    প্রোফাইল
                  </Link>
                  <button onClick={handleSignOut} className="btn btn-error btn-sm w-full">
                    সাইন আউট
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/signin" className="btn btn-outline btn-emerald btn-sm flex-1">
                    সাইন ইন
                  </Link>
                  <Link href="/signup" className="btn bg-emerald-600 text-white btn-sm flex-1">
                    সাইন আপ
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}