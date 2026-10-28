"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না, আবার লিখুন!", { id: "signup-err" });
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!", { id: "signup-err" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সাইন আপ ব্যর্থ হয়েছে!", { id: "signup-err" });
      } else {
        toast.success("সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে! 🎉", { id: "signup-succ" });
        router.push("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("একটি ত্রুটি ঘটেছে!", { id: "signup-err" });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      await signIn.social({
        provider,
        callbackURL: "/",
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
          <h2 className="text-2xl font-extrabold text-gray-900">অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="text-xs text-gray-500 mt-1">বিনামূল্যে সাইন আপ করে সব বিস্তারিত জানুন।</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">নাম</label>
            <input
              type="text"
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />
          </div>

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
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              type="password"
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-800 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
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
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-emerald-700 font-semibold hover:underline">
            সাইন ইন করুন
          </Link>
        </div>
      </div>
    </main>
  );
}