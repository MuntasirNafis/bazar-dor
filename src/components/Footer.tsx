export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
            🛒 বাজার দর
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
        </div>
        <div className="text-xs text-slate-500 max-w-md">
          সকল দাম সম্ভাব্য; বিভিন্ন বাজারের বাস্তব পরিস্থিতির ওপর নির্ভর করে পরিবর্তিত হতে পারে।
        </div>
      </div>
    </footer>
  );
}