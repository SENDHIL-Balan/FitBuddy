import React from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Guidelines from './components/Guidelines.tsx';
import Cta from './components/Cta.tsx';
import Footer from './components/Footer.tsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased selection:bg-[#38488f] selection:text-white">
      <main className="w-full flex flex-col">
        <Navbar />
        <Hero />
        <Guidelines />
        <Cta />
        <Footer />
      </main>
    </div>
  );
}
