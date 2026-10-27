"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn.email(
        { email, password },
        {
          onSuccess: () => {
            toast.success("সফলভাবে সাইন ইন হয়েছে!");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "সাইন ইন ব্যর্থ হয়েছে");
          },
        }
      );
    } catch (err) {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    await signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-12">
      <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-2">বাজার দরে সাইন ইন করুন</h2>
        <p className="text-sm text-center text-base-content/60 mb-6">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>

        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label className="label text-sm font-medium">ইমেইল ঠিকানা</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label text-sm font-medium">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <button type="submit" disabled={loading} className="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full mt-2">
            {loading ? <span className="loading loading-spinner"></span> : "সাইন ইন"}
          </button>
        </form>

        <div className="divider my-6">অথবা</div>

        <div className="space-y-3">
          <button onClick={() => handleSocialSignIn("google")} className="btn btn-outline w-full flex items-center gap-2">
            🌐 গুগল দিয়ে সাইন ইন
          </button>
          <button onClick={() => handleSocialSignIn("github")} className="btn btn-outline w-full flex items-center gap-2">
            💻 গিটহাবে সাইন ইন
          </button>
        </div>

        <p className="text-center text-sm mt-6">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="text-emerald-700 font-semibold hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
}