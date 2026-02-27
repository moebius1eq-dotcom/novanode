export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <span className="text-lg font-bold text-white">
              NoVa<span className="text-indigo-400">Node</span>
            </span>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="/virginia-laptop-policies" className="hover:text-white transition-colors">💻 Laptop Policies</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Submit a Spot</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
          
          {/* Copyright */}
          <div className="text-sm">
            © {new Date().getFullYear()} NoVaNode. All rights reserved.
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs">
          <p>Wi-Fi speeds and noise levels verified on-site. Data may change — always call ahead for critical meetings.</p>
        </div>
        
        {/* E-E-A-T Trust Badge */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Every spot physically visited by our team</span>
            </div>
            <span className="hidden md:inline text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400">⚡</span>
              <span className="text-slate-300">Wi-Fi tested with Speedtest.net</span>
            </div>
            <span className="hidden md:inline text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400">📊</span>
              <span className="text-slate-300">Noise measured with decibel meter</span>
            </div>
            <span className="hidden md:inline text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">🕐</span>
              <span className="text-slate-300">Last Update: Feb 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
