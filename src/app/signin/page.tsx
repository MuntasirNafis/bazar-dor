"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন ব্যর্থ হয়েছে!", { id: "signin-err" });
      } else {
        toast.success("সফলভাবে সাইন ইন করা হয়েছে! 🎉", { id: "signin-succ" });
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      toast.error("একটি ত্রুটি ঘটেছে!", { id: "signin-err" });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      await signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
    } catch (err) {
      console.error("Social login error:", err);
      toast.error("সোশ্যাল লগইন ব্যর্থ হয়েছে!", { id: "social-err" });
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">সাইন ইন করুন</h2>
          <p className="text-xs text-gray-500 mt-1">আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেইল</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-800 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-400">অথবা</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialLogin("google")}
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-3 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            🌐 Google
          </button>
          
          <button
            onClick={() => handleSocialLogin("github")}
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-3 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            🐙 GitHub
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="text-emerald-700 font-semibold hover:underline">
            সাইন আপ করুন
          </Link>
        </div>
      </div>
    </main>
  );
}