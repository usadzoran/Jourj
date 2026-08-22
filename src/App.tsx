import React, { useState } from 'react';

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-[#F7F3EA] flex flex-col items-center justify-between relative overflow-hidden selection:bg-[#D7B45A] selection:text-[#080808]">
      {/* Background ambient luxury lighting */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full pointer-events-none blur-[120px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(215, 180, 90, 0.45) 0%, rgba(138, 107, 39, 0.2) 50%, transparent 80%)'
        }}
      />
      <div 
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full pointer-events-none blur-[140px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(240, 211, 138, 0.3) 0%, rgba(200, 148, 67, 0.15) 50%, transparent 80%)'
        }}
      />

      {/* Top subtle badge */}
      <header className="w-full pt-8 pb-4 flex justify-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616]/80 border border-[#D7B45A]/25 backdrop-blur-md shadow-lg shadow-black/40">
          <span className="text-[#D7B45A] text-xs">✦</span>
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#D7B45A] font-medium">
            Plateforme Officielle
          </span>
          <span className="text-[#D7B45A] text-xs">✦</span>
        </div>
      </header>

      {/* Main Content: Logo & Presentation */}
      <main className="w-full max-w-md px-6 py-6 flex flex-col items-center justify-center text-center z-10 my-auto">
        {!entered ? (
          <div className="flex flex-col items-center w-full">
            {/* Logo Display Container */}
            <div className="relative group mb-8">
              {/* Outer Golden Glow Ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#D7B45A]/30 via-[#F0D38A]/40 to-[#D7B45A]/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Card Container holding the official logo */}
              <div className="relative w-72 sm:w-80 aspect-square rounded-3xl overflow-hidden border border-[#D7B45A]/40 bg-[#121212] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 backdrop-blur-sm">
                <img
                  src="./assets/logo.jpg"
                  alt="Jour J — Le moment qu'on attend pour être heureux"
                  className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  onError={(e) => {
                    // Fallback to src image path if public not ready
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85';
                  }}
                />
              </div>
            </div>

            {/* Typography & Subtitle */}
            <div className="space-y-3 mb-10">
              <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-[0.18em] text-[#F7F3EA] uppercase">
                JOUR <span className="shimmer-text font-semibold">J</span>
              </h1>
              
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D7B45A]/60" />
                <span className="text-xs text-[#D7B45A]">♡</span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D7B45A]/60" />
              </div>

              <p className="text-[11px] sm:text-xs tracking-[0.28em] text-[#D7B45A] font-medium uppercase leading-relaxed">
                LE MOMENT QU'ON ATTEND<br />
                <span className="text-[#A3A3A3] text-[10px] tracking-[0.22em]">POUR ÊTRE HEUREUX</span>
              </p>
            </div>

            {/* Enter Button */}
            <button
              id="btn-enter"
              onClick={() => setEntered(true)}
              className="gold-button w-full sm:w-72 py-4 px-8 rounded-full text-[#111111] font-bold text-sm tracking-[0.22em] uppercase flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>ENTRER</span>
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        ) : (
          /* Transition state after clicking Entrer */
          <div className="flex flex-col items-center w-full py-8 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full border border-[#D7B45A] bg-[#141414] flex items-center justify-center shadow-[0_0_30px_rgba(215,180,90,0.3)]">
              <span className="text-2xl text-[#D7B45A]">♛</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-[#F0D38A]">Bienvenue sur Jour J</h2>
              <p className="text-xs text-[#A3A3A3] max-w-xs leading-relaxed">
                الصفحة الأولى جاهزة بنجاح. ما هي العناصر أو الأقسام التي تود إضافتها في الخطوة التالية؟
              </p>
            </div>

            <button
              onClick={() => setEntered(false)}
              className="px-6 py-2.5 rounded-full border border-[#D7B45A]/40 bg-[#161616] text-xs text-[#D7B45A] hover:bg-[#D7B45A] hover:text-[#111] transition-colors"
            >
              ← العودة إلى البداية
            </button>
          </div>
        )}
      </main>

      {/* Footer / Location indicator */}
      <footer className="w-full pb-6 pt-2 text-center z-10">
        <p className="text-[10px] tracking-[0.2em] text-[#666666] uppercase">
          Oran, Algérie · Événements & Mariages d'Exception
        </p>
      </footer>
    </div>
  );
}
