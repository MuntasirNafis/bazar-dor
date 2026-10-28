"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  const user = session?.user;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">আপনি লগইন করা নেই!</h2>
        <p className="text-sm text-gray-500">প্রোফাইল দেখতে অনুগ্রহ করে প্রথমে সাইন ইন করুন।</p>
        <div>
          <Link href="/signin" className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition">
            সাইন ইন করুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-md overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name?.charAt(0) || "U"
            )}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Link href="/" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium px-5 py-2 rounded-xl transition text-xs">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}