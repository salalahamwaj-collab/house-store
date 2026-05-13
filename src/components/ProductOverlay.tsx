import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, MessageCircle, Wallet, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  vendorRating?: number;
}

interface ProductOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  tag: string;
  products: Product[];
}

export default function ProductOverlay({ isOpen, onClose, tag, products }: ProductOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight uppercase">
                  {tag.replace('_', ' ')}
                </h2>
                <p className="text-xs text-white/40 font-mono uppercase tracking-wider mt-1">
                  Competitive Slot • {products.length} Vendors Engaged
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              {/* Product Carousel / List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {products.length > 0 ? (
                  products.map((p, idx) => (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={cn(
                        "group relative p-6 rounded-xl border transition-all",
                        idx === 0 
                          ? "bg-white/10 border-white/20 ring-1 ring-white/30" 
                          : "bg-white/5 border-white/10 opacity-70 hover:opacity-100"
                      )}
                    >
                      {idx === 0 && (
                        <div className="absolute -top-3 -left-3 bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-tighter">
                          Best Price
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-medium text-white">{p.title}</h3>
                        <span className="text-2xl font-bold text-white">${p.price}</span>
                      </div>
                      
                      <p className="text-sm text-white/60 mb-6 line-clamp-2 italic font-serif">
                        "{p.description}"
                      </p>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-white text-black text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/90 transition-all uppercase">
                          <Wallet size={16} /> Secure Escrow
                        </button>
                        <button className="p-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all text-white/60 hover:text-white">
                          <MessageCircle size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center text-white/40 font-mono text-sm border border-dashed border-white/10 rounded-xl">
                    No active listings for this target.
                  </div>
                )}
              </div>

              {/* Custom Request Section */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                    <Info size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white mb-1">Request Custom Build</h4>
                    <p className="text-sm text-white/50 mb-4">
                      Upload an image of a design you like. Our vendors will reverse-bid to build it for you at the best price.
                    </p>
                    <button className="text-xs font-bold text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 transition-all uppercase tracking-wide">
                      Submit Design Probe
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/30 font-mono uppercase mb-1">Est. Response</div>
                    <div className="text-lg font-bold text-white tracking-tight">~4 Hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-white/30 font-mono uppercase tracking-[0.2em]">
              <div className="flex gap-6">
                <span>Mesh ID: {tag}</span>
                <span>Anonymized: Yes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Market Sync
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
