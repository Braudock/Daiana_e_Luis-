import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Heart, Sparkles, Image as ImageIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import photoList from './photoList.json';

// Componente Principal
function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'gallery'>('home');
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (musicOn) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setMusicOn(!musicOn);
  };

  return (
    <div className="min-h-screen relative font-sans">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0608]">
        {/* Usando um vídeo público como fallback já que os locais podem não carregar */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-40"
        >
          <source src="/media/LUIS_E_DAI.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0608b3] via-[#0a060873] to-[#0a0608e0]"></div>
        <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none"></div>
      </div>

      {/* Audio */}
      <audio ref={audioRef} loop src="/media/meu_trecho_de_musica.mp3" />

      {/* Header & Controls */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
        <div className="text-gold-light opacity-80 font-serif tracking-[4px] uppercase text-sm">
          D & L
        </div>
        
        <div className="flex items-center gap-6">
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-serif uppercase tracking-[3px] text-[0.8rem] text-gold-light opacity-80">
            <button onClick={() => setActiveTab('home')} className={`hover:text-gold transition-colors ${activeTab === 'home' ? 'text-gold' : ''}`}>Início</button>
            <button onClick={() => setActiveTab('gallery')} className={`hover:text-gold transition-colors ${activeTab === 'gallery' ? 'text-gold' : ''}`}>Galeria</button>
          </nav>

          {/* Music Toggle */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-[0.75rem] text-gold-light opacity-60 tracking-[3px] uppercase hidden sm:inline-block">
              Nossa Vibe
            </span>
            <button 
              onClick={toggleMusic}
              className="w-12 h-12 rounded-full border border-gold/40 bg-[#0a0608a6] backdrop-blur-md flex items-center justify-center text-gold hover:border-gold hover:bg-gold/10 transition-all"
            >
              {musicOn ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeView key="home" />}
          {activeTab === 'gallery' && <GalleryView key="gallery" />}
        </AnimatePresence>
      </main>
      
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0608e6] backdrop-blur-md border-t border-gold/10 p-4 flex justify-around">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-gold' : 'text-gold-light/60'}`}>
          <Heart size={20} />
          <span className="text-[0.6rem] uppercase tracking-widest">Início</span>
        </button>
        <button onClick={() => setActiveTab('gallery')} className={`flex flex-col items-center gap-1 ${activeTab === 'gallery' ? 'text-gold' : 'text-gold-light/60'}`}>
          <ImageIcon size={20} />
          <span className="text-[0.6rem] uppercase tracking-widest">Galeria</span>
        </button>
      </nav>
    </div>
  );
}

// Visualização: Home
function HomeView() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const diff = new Date().getTime() - new Date('2026-05-02T00:00:00').getTime();
    setDays(Math.floor(diff / 86400000));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col items-center justify-center text-center"
    >
      <span className="font-serif text-[0.85rem] tracking-[5px] uppercase text-gold opacity-80 mb-4 block">
        02 de Maio · 2026 · Velho Pietro
      </span>
      <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white drop-shadow-[0_0_60px_rgba(201,169,110,0.3)] mb-6 leading-tight">
        Daiana & Luis
      </h1>
      <p className="font-serif text-lg md:text-2xl text-gold-light tracking-[4px] uppercase italic opacity-90 max-w-2xl mx-auto mb-16">
        Arquivo afetivo integrado da nossa história
      </p>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full max-w-md mt-8 mx-auto">
        <div className="p-8 border border-gold/15 rounded-sm bg-gold/5 backdrop-blur-sm text-center">
          <span className="font-display text-5xl text-gold block leading-none">{days}</span>
          <span className="font-serif text-[0.7rem] tracking-[4px] uppercase text-gold-light opacity-60 mt-3 block">Dias de Nós</span>
        </div>
      </div>
    </motion.div>
  );
}

// Visualização: Galeria
function GalleryView() {
  // Array de fotos
  const photos = photoList.map(name => `/media/${name}`);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="text-center mb-16">
        <span className="font-serif text-[0.72rem] tracking-[6px] uppercase text-gold opacity-70 block mb-4">
          Nossa Galeria
        </span>
        <h2 className="font-display text-5xl md:text-6xl text-gold-light mb-8">Memórias</h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {photos.map((src, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="aspect-square relative overflow-hidden group cursor-pointer"
          >
            <img src={src} alt={`Memória ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}



export default App;
