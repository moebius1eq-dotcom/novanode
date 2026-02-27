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
      </div>
    </footer>
  );
}
