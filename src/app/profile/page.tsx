"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-2xl font-bold">অনুগ্রহ করে প্রথমে সাইন ইন করুন!</h2>
        <Link href="/signin" className="btn bg-emerald-600 text-white">
          সাইন ইন পেজে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card bg-base-100 border border-base-200 shadow-md p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-emerald-500 ring-offset-2">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} />
              ) : (
                <span className="text-3xl font-bold flex items-center justify-center h-full bg-emerald-100 text-emerald-800">
                  {session.user.name?.charAt(0) || "ইউ"}
                </span>
              )}
            </div>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-sm text-base-content/60">{session.user.email}</p>
            <span className="badge badge-success text-white mt-2">অ্যাক্টিভ অ্যাকাউন্ট</span>
          </div>
        </div>

        <div className="divider my-6"></div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">অ্যাকাউন্ট ইনফরমেশন</h3>
          <div className="bg-base-200/50 p-4 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/60">ইউজার আইডি:</span>
              <span className="font-mono font-medium">{session.user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">ইমেইল ভেরিফাইড:</span>
              <span className="font-medium">{session.user.emailVerified ? "হ্যাঁ" : "না"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}