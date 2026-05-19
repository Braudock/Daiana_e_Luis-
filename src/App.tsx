import { useState, useEffect, useRef } from 'react';

// Photos to use throughout the letter (spread across 325)
const PHOTOS = [
  '/media/daiana_luis_foto_001.png',
  '/media/daiana_luis_foto_020.png',
  '/media/daiana_luis_foto_045.png',
  '/media/daiana_luis_foto_080.png',
  '/media/daiana_luis_foto_110.png',
  '/media/daiana_luis_foto_150.png',
  '/media/daiana_luis_foto_180.png',
  '/media/daiana_luis_foto_210.png',
  '/media/daiana_luis_foto_240.png',
  '/media/daiana_luis_foto_270.png',
  '/media/daiana_luis_foto_300.png',
  '/media/daiana_luis_foto_319.png',
];

const GALLERY_PHOTOS = Array.from({ length: 32 }, (_, i) => {
  const n = (i * 10 + 1).toString().padStart(3, '0');
  return `/media/daiana_luis_foto_${n}.png`;
});

function useIntersection(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold, rootMargin: '0px 0px -60px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Block({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useIntersection(0.08);
  return (
    <div
      ref={ref}
      className={`block ${visible ? 'show' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [musicOn, setMusicOn] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (musicOn) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    setMusicOn(!musicOn);
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y < vh * 1.5) {
        setOpacity(Math.max(0, 1 - y / (vh * 0.8)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --bg:#080604; --paper:#0f0c09;
          --gold:#b8924a; --gold-dim:#6b5228; --gold-glow:#c9a05a;
          --cream:#ede8df; --cream-2:#b0a898; --cream-3:#6e6660;
          --red:#8c3030;
        }
        html { scroll-behavior:smooth; }
        body {
          background:var(--bg);
          color:var(--cream);
          font-family:'EB Garamond',Georgia,serif;
          min-height:100vh;
          overflow-x:hidden;
        }
        body::after {
          content:'';
          position:fixed; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events:none; z-index:999;
        }
        /* Opening */
        #opening {
          min-height:100vh;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          text-align:center; padding:3rem 2rem;
          position:relative; overflow:hidden;
        }
        #opening-video {
          position:absolute; inset:0;
          width:100%; height:100%; object-fit:cover;
          opacity:0.22;
          z-index:0;
        }
        #opening-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom, #080604aa 0%, #08060460 50%, #080604cc 100%);
          z-index:1;
        }
        #opening > *:not(video):not(#opening-overlay) { position:relative; z-index:2; }
        #opening::before {
          content:''; position:absolute;
          bottom:0; left:50%; transform:translateX(-50%);
          width:1px; height:60px;
          background:linear-gradient(to bottom,var(--gold-dim),transparent);
          z-index:2;
        }
        .o-label {
          font-family:'Cormorant SC',serif;
          font-weight:300; letter-spacing:.35em;
          font-size:clamp(.7rem,1.5vw,.85rem);
          color:var(--gold-dim); text-transform:uppercase;
          opacity:0; animation:riseIn 1.2s ease forwards .4s;
          margin-bottom:1.8rem;
        }
        .o-title {
          font-family:'Playfair Display',serif;
          font-style:italic; font-weight:400;
          font-size:clamp(2.6rem,7vw,6.5rem);
          line-height:1.08; color:var(--cream);
          opacity:0; animation:riseIn 1.4s ease forwards .9s;
          max-width:900px;
          text-shadow:0 0 80px rgba(184,146,74,.08);
        }
        .o-title .gold { color:var(--gold-glow); }
        .o-sub {
          font-style:italic; font-weight:400;
          font-size:clamp(1rem,2.2vw,1.3rem);
          color:var(--cream-2); line-height:1.75;
          max-width:540px; margin-top:2rem;
          opacity:0; animation:riseIn 1.4s ease forwards 1.4s;
        }
        @keyframes riseIn {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        /* Letter */
        .letter-wrap {
          max-width:740px; margin:0 auto;
          padding:0 clamp(1.5rem,6vw,5rem) 8rem;
          position:relative;
        }
        .chapter {
          font-family:'Cormorant SC',serif;
          font-weight:300; letter-spacing:.3em;
          font-size:clamp(.65rem,1.2vw,.8rem);
          color:var(--gold-dim); text-transform:uppercase;
          margin-bottom:1rem; margin-top:0;
          display:flex; align-items:center; gap:1rem;
        }
        .chapter::after {
          content:''; flex:1; height:1px;
          background:linear-gradient(to right,var(--gold-dim),transparent);
        }
        /* Block animation */
        .block {
          margin-bottom:5rem;
          opacity:0; transform:translateY(32px);
          transition:opacity .9s ease, transform .9s ease;
        }
        .block.show { opacity:1; transform:translateY(0); }
        .block p {
          font-size:clamp(1.15rem,2.3vw,1.38rem);
          line-height:1.92; font-weight:400;
          color:var(--cream-2); margin-bottom:1.4rem;
        }
        .block p:last-child { margin-bottom:0; }
        .block p strong { color:var(--cream); font-weight:500; }
        .block p em { color:var(--gold-glow); font-style:italic; }
        /* Photo inline */
        .photo-float {
          width:100%; max-height:520px; object-fit:cover;
          margin:2.5rem 0;
          filter:brightness(.85) saturate(.9);
          border:1px solid rgba(184,146,74,.1);
        }
        .photo-pair {
          display:grid; grid-template-columns:1fr 1fr;
          gap:2px; margin:2.5rem 0;
        }
        .photo-pair img {
          width:100%; height:320px; object-fit:cover;
          filter:brightness(.82) saturate(.88);
        }
        /* Big quote */
        .big-quote {
          border-left:2px solid var(--gold-dim);
          padding:1.8rem 2rem 1.8rem 2.4rem;
          margin:3.5rem 0;
          background:rgba(184,146,74,.03);
        }
        .big-quote p {
          font-family:'Playfair Display',serif;
          font-style:italic;
          font-size:clamp(1.25rem,2.8vw,1.65rem) !important;
          line-height:1.65 !important;
          color:var(--cream) !important;
          margin-bottom:.8rem !important;
        }
        .big-quote cite {
          font-size:.8rem; letter-spacing:.18em;
          color:var(--gold-dim); text-transform:uppercase;
          font-style:normal;
        }
        /* Confession */
        .confession-box {
          border:1px solid rgba(140,48,48,.35);
          border-radius:2px;
          padding:clamp(2rem,5vw,3.5rem);
          margin:4rem 0;
          background:rgba(140,48,48,.04);
          position:relative;
        }
        .confession-box::before {
          content:''; position:absolute;
          top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(140,48,48,.5),transparent);
        }
        .confession-box .headline {
          font-family:'Playfair Display',serif;
          font-size:clamp(1.5rem,3.5vw,2.4rem);
          font-style:italic; line-height:1.25;
          color:var(--cream); margin-bottom:1.6rem;
        }
        .confession-box p {
          font-size:clamp(1.1rem,2vw,1.28rem);
          line-height:1.88; color:var(--cream-2);
          margin-bottom:1.1rem;
        }
        .confession-box p:last-child { margin-bottom:0; }
        .confession-box p strong { color:var(--cream); font-weight:500; }
        /* Memories grid */
        .memories {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(210px,1fr));
          gap:1px; margin:3rem 0;
          border:1px solid rgba(184,146,74,.1);
          border-radius:2px; overflow:hidden;
        }
        .mem {
          padding:0; background:rgba(184,146,74,.02);
          border-right:1px solid rgba(184,146,74,.07);
          border-bottom:1px solid rgba(184,146,74,.07);
          transition:background .3s; overflow:hidden;
          position:relative; aspect-ratio:1/1;
        }
        .mem img {
          width:100%; height:100%; object-fit:cover;
          filter:brightness(.75) saturate(.8);
          transition:filter .4s, transform .5s;
        }
        .mem:hover img { filter:brightness(.9) saturate(1); transform:scale(1.04); }
        .mem-caption {
          position:absolute; bottom:0; left:0; right:0;
          padding:.8rem 1rem;
          background:linear-gradient(transparent, rgba(8,6,4,.85));
          font-size:.9rem; line-height:1.4;
          color:var(--cream-2);
        }
        /* Statement */
        .statement {
          text-align:center; padding:5rem 2rem;
          position:relative;
        }
        .statement::before, .statement::after {
          content:''; display:block; width:1px; height:50px;
          background:linear-gradient(to bottom,transparent,var(--gold-dim),transparent);
          margin:0 auto 3rem;
        }
        .statement::after { margin:3rem auto 0; }
        .statement h2 {
          font-family:'Playfair Display',serif;
          font-style:italic; font-weight:400;
          font-size:clamp(2rem,5vw,4rem);
          line-height:1.2; color:var(--cream);
        }
        .statement h2 span { color:var(--gold-glow); }
        /* Video section */
        .video-section {
          margin:5rem 0; position:relative;
          border:1px solid rgba(184,146,74,.08);
        }
        .video-section video {
          width:100%; max-height:420px; object-fit:cover;
          display:block;
          filter:brightness(.75) saturate(.85);
        }
        .video-caption {
          text-align:center; padding:1.2rem;
          font-style:italic; font-size:clamp(.9rem,1.8vw,1.1rem);
          color:var(--cream-3);
          border-top:1px solid rgba(184,146,74,.08);
        }
        /* Final letter */
        .final-letter {
          border-top:1px solid rgba(184,146,74,.12);
          padding-top:4rem; margin-top:5rem;
        }
        .final-letter .salutation {
          font-family:'Playfair Display',serif;
          font-style:italic;
          font-size:clamp(1.5rem,3.5vw,2.5rem);
          color:var(--cream); margin-bottom:2.5rem; display:block;
        }
        .final-letter p {
          font-size:clamp(1.1rem,2.2vw,1.32rem);
          line-height:1.95; color:var(--cream-2);
          margin-bottom:1.5rem;
        }
        .final-letter p strong { color:var(--cream); font-weight:500; }
        .final-letter p em { color:var(--gold-glow); font-style:italic; }
        /* Signature */
        .assinatura {
          margin-top:4rem; text-align:right; padding-right:1rem;
        }
        .assinatura .de {
          font-size:.8rem; letter-spacing:.25em;
          color:var(--gold-dim); text-transform:uppercase;
          display:block; margin-bottom:.5rem;
        }
        .assinatura .nome {
          font-family:'Playfair Display',serif;
          font-style:italic;
          font-size:clamp(2rem,4vw,3rem);
          color:var(--gold-glow);
        }
        /* Gallery strip */
        .gallery-strip {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:2px; margin:4rem 0;
        }
        @media(max-width:600px) { .gallery-strip { grid-template-columns:repeat(2,1fr); } }
        .gallery-strip img {
          width:100%; aspect-ratio:1/1; object-fit:cover;
          filter:brightness(.78) saturate(.8);
          transition:filter .4s, transform .5s;
        }
        .gallery-strip img:hover { filter:brightness(.95) saturate(1.05); transform:scale(1.03); }
        /* Separator */
        .sep {
          width:100%; height:1px;
          background:linear-gradient(90deg,transparent,rgba(184,146,74,.12),transparent);
          margin:1rem 0;
        }
        /* Footer */
        footer {
          text-align:center; padding:5rem 2rem 6rem;
          position:relative;
        }
        footer::before {
          content:''; display:block; width:1px; height:80px;
          background:linear-gradient(to bottom,rgba(184,146,74,.25),transparent);
          margin:0 auto 3rem;
        }
        footer p {
          font-family:'EB Garamond',serif;
          font-style:italic; font-size:clamp(1rem,2vw,1.25rem);
          color:var(--cream-3); line-height:1.8;
        }
        footer .daiana-final {
          font-family:'Playfair Display',serif;
          font-style:italic;
          font-size:clamp(2.5rem,6vw,4.5rem);
          color:var(--gold-glow); opacity:.35;
          display:block; margin-top:.5rem;
          letter-spacing:-.01em;
        }
        /* Music btn */
        .music-btn {
          position:fixed; bottom:2rem; right:2rem; z-index:998;
          width:48px; height:48px; border-radius:50%;
          border:1px solid rgba(184,146,74,.5);
          background:rgba(8,6,4,.85);
          color:var(--gold); cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          font-size:1.3rem;
          transition:border-color .3s, background .3s;
          backdrop-filter:blur(8px);
        }
        .music-btn:hover {
          border-color:var(--gold);
          background:rgba(184,146,74,.12);
        }
        .music-btn.on { border-color:var(--gold-glow); color:var(--gold-glow); }
      `}</style>

      {/* Music */}
      <audio ref={audioRef} loop src="/media/meu_trecho_de_musica.mp3" />
      <button
        className={`music-btn ${musicOn ? 'on' : ''}`}
        onClick={toggleMusic}
        title={musicOn ? 'Pausar música' : 'Tocar música'}
      >
        {musicOn ? '⏸' : '▶'}
      </button>

      {/* ═══ ABERTURA ═══ */}
      <section id="opening" style={{ opacity }}>
        <video id="opening-video" autoPlay muted loop playsInline>
          <source src="/media/LUIS_E_DAI.mp4" type="video/mp4" />
          <source src="/media/daiana_luis_video_001.mp4" type="video/mp4" />
        </video>
        <div id="opening-overlay" />
        <p className="o-label">Uma carta de amor — Daiana & Luís, desde 2016</p>
        <h1 className="o-title">
          Você foi<br />
          a melhor coisa<br />
          que me <span className="gold">aconteceu.</span>
        </h1>
        <p className="o-sub">
          Quase 10 anos de história.<br />
          E eu queria que o mundo soubesse o quanto você vale.
        </p>
      </section>

      {/* ═══ CARTA ═══ */}
      <main className="letter-wrap">

        {/* BLOCO 1 */}
        <Block>
          <img src={PHOTOS[0]} alt="" className="photo-float" />
          <p className="chapter">I — o começo de tudo</p>
          <div className="confession-box">
            <p className="headline">Você entrou na minha vida<br />e eu nunca mais fui o mesmo.</p>
            <p>
              Desde aquele primeiro momento, algo mudou. <strong>Você me fez enxergar o mundo com olhos diferentes</strong> — com mais cor, com mais significado, com mais vontade de ser alguém melhor.
            </p>
            <p>
              E eu quero que você saiba, antes de qualquer coisa: <strong>cada memória que construímos juntos foi real. Cada risada, cada olhar, cada abraço — real.</strong>
            </p>
          </div>
        </Block>

        {/* BLOCO 2 */}
        <Block>
          <p className="chapter">II — o que você é pra mim</p>
          <div className="big-quote">
            <p>"Há pessoas que chegam e mudam tudo — sem pedir permissão, sem aviso. Você foi assim."</p>
          </div>
          <p>
            Você é a pessoa que ri das minhas piadas ruins às duas da manhã. Que fica do meu lado mesmo quando eu sou difícil. Que me conhece com uma profundidade que assusta e encanta ao mesmo tempo.
          </p>
          <p>
            <em>Você é minha parceira, minha melhor amiga, meu lar.</em> E lar não é um lugar — é uma sensação. E essa sensação tem o seu nome.
          </p>

          <div className="photo-pair">
            <img src={PHOTOS[1]} alt="" />
            <img src={PHOTOS[2]} alt="" />
          </div>
        </Block>

        {/* VIDEO */}
        <Block>
          <div className="video-section">
            <video autoPlay muted loop playsInline>
              <source src="/media/daiana_luis_video_001.mp4" type="video/mp4" />
            </video>
            <p className="video-caption">Alguns dos nossos momentos — eternizados.</p>
          </div>
        </Block>

        {/* BLOCO 3 */}
        <Block>
          <p className="chapter">III — o que eu aprendi com você</p>
          <p>
            Com você aprendi que <strong>amor de verdade não tem ego</strong>. Que às vezes o silêncio junto vale mais do que mil palavras. Que dois cafés pela manhã podem ser o maior ato de cuidado do mundo.
          </p>
          <p>
            Você me ensinou a <em>desacelerar e sentir</em>. A estar presente. A não desperdiçar os pequenos momentos porque, no final, são eles que viram grandes memórias.
          </p>

          <div className="big-quote">
            <p>"O amor não é o que você sente num momento de felicidade. É o que você escolhe nos momentos difíceis."</p>
          </div>

          <img src={PHOTOS[3]} alt="" className="photo-float" />
        </Block>

        {/* MEMÓRIAS */}
        <Block>
          <p className="chapter">IV — os momentos que guardo</p>
          <p>
            Cada foto abaixo é uma prova. De que vivemos de verdade. De que rimos de verdade.
            <strong> De que amamos de verdade.</strong>
          </p>

          <div className="memories">
            {[PHOTOS[4], PHOTOS[5], PHOTOS[6], PHOTOS[7], PHOTOS[8], PHOTOS[9]].map((src, i) => (
              <div className="mem" key={i}>
                <img src={src} alt="" />
                <p className="mem-caption">{[
                  'Cada sorriso seu é meu favorito',
                  'Os momentos simples que fazem a vida',
                  'Quando o tempo parou pra nós dois',
                  'Tudo que eu precisava estava aqui',
                  'Você, sempre você',
                  'Nossa história, quadro a quadro'
                ][i]}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* STATEMENT */}
        <div className="statement block show">
          <h2>
            Você é<br />
            <span>o amor da minha vida.</span>
          </h2>
        </div>

        {/* VIDEO 2 */}
        <Block>
          <div className="video-section">
            <video autoPlay muted loop playsInline>
              <source src="/media/daiana_luis_video_002.mp4" type="video/mp4" />
            </video>
            <p className="video-caption">A gente junto — o melhor vídeo que existe.</p>
          </div>
        </Block>

        {/* BLOCO 5 */}
        <Block>
          <p className="chapter">V — o que sinto quando penso em você</p>

          <div className="photo-pair">
            <img src={PHOTOS[10]} alt="" />
            <img src={PHOTOS[11]} alt="" />
          </div>

          <p>
            Pensar em você é sentir aquela <em>quentura no peito</em> que não tem explicação racional. É lembrar do seu cheiro, do jeito que você inclina a cabeça quando está curiosa, da sua risada que some e aparece do nada.
          </p>
          <p>
            <strong>Você é a minha pessoa.</strong> Assim, simples. Sem condições, sem ressalvas. Você.
          </p>
        </Block>

        {/* GALERIA */}
        <Block>
          <p className="chapter">VI — nossa história em imagens</p>
          <div className="gallery-strip">
            {GALLERY_PHOTOS.map((src, i) => (
              <img key={i} src={src} alt={`Memória ${i + 1}`} />
            ))}
          </div>
        </Block>

        {/* CARTA FINAL */}
        <div className="final-letter block show">
          <p className="chapter">VII — a carta que você merece</p>
          <span className="salutation">Daiana,</span>

          <p>
            Existem coisas que a gente sente mas tem medo de dizer em voz alta, com medo de que ao pronunciar, de alguma forma, a magia se desfaça. <em>Mas eu escolho a coragem hoje.</em>
          </p>
          <p>
            Você merece ouvir que <strong>é extraordinária</strong>. Não no sentido genérico e vazio que as pessoas usam. Mas no sentido real: você superou coisas que a maioria não conseguiria. Você ama com uma inteireza que é rara e preciosa. Você olha pro mundo com uma profundidade que me encanta todos os dias.
          </p>
          <p>
            Cada foto que tiramos juntos é um capítulo de uma história que eu tenho orgulho de ter vivido. Cada momento — os fáceis e os difíceis — me moldou de uma forma que não consigo imaginar sem você.
          </p>
          <p>
            <strong>Você vai sempre ser o maior presente que a vida me deu.</strong> E eu pretendo honrar isso todos os dias — sendo o parceiro que você merece, estando presente, crescendo, evoluindo.
          </p>
          <p>
            <em>Te amo. Com tudo que sou e tudo que estou me tornando.</em>
          </p>

          <div className="assinatura">
            <span className="de">Com amor, com verdade, com o coração inteiro</span>
            <span className="nome">Luís Ricardo</span>
          </div>
        </div>

      </main>

      {/* ═══ RODAPÉ ═══ */}
      <footer>
        <p>
          Desde 2016, juntos.<br />
          <em>— Quase uma década de amor real.</em>
        </p>
        <span className="daiana-final">Daiana.</span>
      </footer>
    </>
  );
}
