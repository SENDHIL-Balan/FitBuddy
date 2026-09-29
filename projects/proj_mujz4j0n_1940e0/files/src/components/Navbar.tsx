import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F8FAFC]/90 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#38488f] flex items-center justify-center text-white font-bold shadow-md shadow-[#38488f]/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">
              Example Domain
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#documentation" className="text-sm font-medium text-slate-600 hover:text-[#38488f] transition-colors">
              Documentation
            </a>
            <a href="#standards" className="text-sm font-medium text-slate-600 hover:text-[#38488f] transition-colors">
              Standards & RFCs
            </a>
            <a href="#guidelines" className="text-sm font-medium text-slate-600 hover:text-[#38488f] transition-colors">
              IANA Guidelines
            </a>
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#cta"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#38488f] hover:opacity-95 rounded-xl shadow-sm shadow-[#38488f]/30 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <span>More Information</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-200 bg-[#F8FAFC] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <a
            href="#documentation"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-[#38488f] rounded-lg hover:bg-slate-100/70"
          >
            Documentation
          </a>
          <a
            href="#standards"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-[#38488f] rounded-lg hover:bg-slate-100/70"
          >
            Standards & RFCs
          </a>
          <a
            href="#guidelines"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-[#38488f] rounded-lg hover:bg-slate-100/70"
          >
            IANA Guidelines
          </a>
          <div className="pt-2">
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 px-4 py-3 text-center text-sm font-semibold text-white bg-[#38488f] rounded-xl shadow-md"
            >
              <span>More Information</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
