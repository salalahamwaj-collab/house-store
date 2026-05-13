import React, { useState, useEffect } from 'react';
import Scene360 from './components/Scene360';
import ProductOverlay from './components/ProductOverlay';
import { LayoutDashboard, Wallet, Home, Bell } from 'lucide-react';

export default function App() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleObjectClick = async (tag: string) => {
    setSelectedTag(tag);
    setIsOverlayOpen(true);
    
    // Fetch products from our Express API
    try {
      const response = await fetch(`/api/products/slot/${tag}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Mini Sidebar */}
      <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-[#0a0a0a] z-20">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black">
          OV
        </div>
        
        <div className="flex flex-col gap-8 text-white/40">
          <button className="p-3 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Home size={24} />
          </button>
          <button className="p-3 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <LayoutDashboard size={24} />
          </button>
          <button className="p-3 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Wallet size={24} />
          </button>
          <button className="p-3 hover:bg-white/5 hover:text-white rounded-xl transition-all relative">
            <Bell size={24} />
            <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        <Scene360 onObjectClick={handleObjectClick} />
        
        <ProductOverlay 
          isOpen={isOverlayOpen} 
          onClose={() => setIsOverlayOpen(false)} 
          tag={selectedTag || ''}
          products={products}
        />

        {/* Global Market Stats Floating Bar */}
        <div className="absolute top-8 right-8 flex gap-4 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,1)]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/60">
              Live Flow: $12.4K / Day
            </span>
          </div>
          <div className="bg-white/90 px-6 py-3 rounded-full flex items-center gap-2 text-black font-bold text-xs uppercase tracking-tight pointer-events-auto cursor-pointer hover:bg-white transition-colors">
            Vendor Center <ChevronRight size={16} />
          </div>
        </div>
      </main>
    </div>
  );
}

function ChevronRight({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
