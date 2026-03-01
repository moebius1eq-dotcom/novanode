import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <a href="#" className="block text-center px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
          📱 Download the NoVaNode App
        </a>
        <a href="/#" className="block text-center px-4 py-3 rounded-lg border border-slate-300 text-slate-800 font-semibold hover:bg-slate-50">
          🌐 Live Seat Map
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-6 flex items-center justify-center gap-5 text-sm text-slate-500">
        <Link href="/privacy" className="hover:text-slate-700">Privacy Policy</Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-slate-700">Terms</Link>
        <span>•</span>
        <Link href="/contact" className="hover:text-slate-700">Contact</Link>
      </div>
    </footer>
  );
}
