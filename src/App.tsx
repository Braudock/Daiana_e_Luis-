import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import photoList from './photoList.json';
import './App.css';

const mediaPath = (name: string) => `/media/${name}`;

const featuredPhotos = [
  'daiana_luis_foto_001.png',
  'daiana_luis_foto_031.png',
  'daiana_luis_foto_090.png',
  'daiana_luis_foto_117.png',
  'daiana_luis_foto_175.png',
  'daiana_luis_foto_214.png',
  'daiana_luis_foto_246.png',
  'daiana_luis_foto_277.png',
  'daiana_luis_foto_319.png',
];

const videoMoments = [
  'daiana_luis_video_001.mp4',
  'daiana_luis_video_003.mp4',
  'daiana_luis_video_005.mp4',
  'final_video_mp_.mp4',
];

const memoryCards = [
  {
    icon: 'cafe',
    text: 'O café na cama que a gente construiu como ritual',
  },
  {
    icon: 'moto',
    text: 'A moto sem destino, só o vento e nós dois desde 2016',
  },
  {
    icon: 'serie',
    text: 'A nossa série, repetida, infinita, ainda nossa',
  },
  {
    icon: 'banho',
    text: 'Pedir pra esfregar as costas, a intimidade mais simples',
  },
  {
    icon: 'amor',
    text: 'Um amorzinho mesmo brigados, como só você fazia',
  },
  {
    icon: 'nos',
    text: 'Descobrir juntos que a gente não estava louco, só diferente',
  },
];

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const openingRef = useRef<HTMLElement>(null);
  const [musicOn, setMusicOn] = useState(false);

  const galleryPhotos = useMemo(
    () => photoList.slice(0, 56).map((name) => mediaPath(name)),
    [],
  );

  useEffect(() => {
    const blocks = document.querySelectorAll('.letter-block');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' },
    );

    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fadeOpening = () => {
      const opening = openingRef.current;
      if (!opening) return;

      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.5) {
        const fade = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
        opening.style.opacity = `${fade}`;
      }
    };

    window.addEventListener('scroll', fadeOpening, { passive: true });
    return () => window.removeEventListener('scroll', fadeOpening);
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }

    try {
      await audio.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }
  };

  return (
    <div className="love-letter-page">
      <audio ref={audioRef} loop src={mediaPath('meu_trecho_de_musica.mp3')} />

      <button
        className={`music-button ${musicOn ? 'playing' : ''}`}
        type="button"
        onClick={toggleMusic}
        aria-label={musicOn ? 'Pausar música' : 'Tocar música'}
        title={musicOn ? 'Pausar música' : 'Tocar música'}
      >
        {musicOn ? <Pause size={17} /> : <Play size={17} />}
        <Volume2 size={16} />
      </button>

      <section className="opening" ref={openingRef}>
        <video className="opening-video" autoPlay muted loop playsInline>
          <source src={mediaPath('LUIS_E_DAI.mp4')} type="video/mp4" />
        </video>
        <div className="opening-shade" />
        <p className="o-label">Uma carta de quem errou - Para Daiana Lourenço</p>
        <h1 className="o-title">
          Desde 2016,
          <br />
          você é parte
          <br />
          do meu <span>mundo.</span>
        </h1>
        <p className="o-sub">
          Eu não mereço a carta que você me escreveu.
          <br />
          Mas você merece a resposta mais honesta que eu já escrevi.
        </p>
      </section>

      <main className="letter-wrap">
        <section className="letter-block">
          <Chapter title="I - o que eu fiz" />
          <div className="confession-box">
            <p className="headline">
              Eu menti pra você.
              <br />
              Muitas vezes. E sabia.
            </p>
            <p>
              Não tem como suavizar isso. Não tem contexto que justifique. Não tem
              "mas" que alivie. Você me escreveu a coisa mais honesta que alguém
              já disse sobre mim: <strong>que eu cheguei a usar suas vulnerabilidades
              conscientemente</strong>. Eu precisava ter a coragem de olhar pra
              isso de frente.
            </p>
            <p>
              Você me conhece desde 2016. Você viu versões minhas que quase ninguém
              viu. Você me conheceu tão fundo que eu sabia exatamente onde doía. E
              em algum momento, usei isso. <strong>Isso não foi falta de amor. Foi
              falta de caráter.</strong> E só agora estou conseguindo pronunciar
              essa frase sem me esconder atrás de explicação nenhuma.
            </p>
          </div>
        </section>

        <PhotoSpread photos={featuredPhotos.slice(0, 3)} caption="O que existiu de bonito continua sendo verdade." />

        <section className="letter-block">
          <Chapter title="II - antes de mentir pra você" />
          <Quote text="Espero que se lembre que antes de mentir pra mim, mentiu pra si mesmo." />
          <p>
            Essa frase me parou. Porque é a mais precisa que você poderia ter
            escolhido. Cada mentira que te contei começou como uma mentira que eu
            contei pra mim mesmo: <em>que estava tudo bem, que eu dava conta, que
            eu não precisava olhar pra mim mesmo.</em>
          </p>
          <p>
            A neurodivergência, a ansiedade, tudo que a gente descobriu junto, eu
            aprendi os nomes mas não aprendi a responsabilidade que vem com isso.
            <strong> Diagnosticar não é desculpa. É só o começo do trabalho.</strong>
            E eu parei no diagnóstico.
          </p>
          <p>
            Você ficou ao meu lado enquanto eu aprendi o que minha cabeça é. Em
            quase uma década de nós, você sustentou conversas, fases, quedas,
            planos e descobertas. E em vez de usar isso pra ser melhor, eu usei
            como escudo pra não mudar.
          </p>
        </section>

        <VideoStrip videos={videoMoments.slice(0, 2)} />

        <section className="letter-block">
          <Chapter title="III - o que eu diminuí" />
          <p>
            Você disse que eu fui te diminuindo aos poucos. Isso me dói de um jeito
            específico porque <strong>você é a pessoa mais inteira que eu já
            conheci.</strong> Você que passou pela depressão e ainda conseguia
            acreditar que a vida presta. Você que carregou seus sonhos mesmo quando
            eu não soube escutá-los direito.
          </p>
          <p>
            E eu, que te conhecia tão bem, <em>usei esse conhecimento pra te tornar
            menor</em> em vez de te tornar maior. Isso é a coisa mais covarde que
            alguém pode fazer com quem ama.
          </p>
          <Quote text="Os sonhos quando sonhamos juntos têm que ser devidamente explicados. Que o sonho, sem planejamento, sem escuta e acolhida não é nada." />
          <p>
            Eu sonhava em voz alta e agia em silêncio. <strong>Isso não é parceria.
            É monólogo disfarçado de amor.</strong> Você merecia um homem que não
            só ouvisse seus sonhos, mas que planejasse junto, que acolhesse, que
            estivesse presente de verdade.
          </p>
        </section>

        <PhotoSpread photos={featuredPhotos.slice(3, 6)} caption="Essas fotos existem porque a nossa história existiu de verdade." />

        <section className="letter-block">
          <Chapter title="IV - o que eu deixei escapar" />
          <p>
            Você listou o que vai sentir falta. Eu li cada linha. E cada item foi
            um soco porque <strong>eu tinha tudo isso e não soube segurar.</strong>
          </p>

          <div className="memories">
            {memoryCards.map((memory) => (
              <article className="mem" key={memory.text}>
                <span className={`memory-icon ${memory.icon}`} aria-hidden="true" />
                <p>{memory.text}</p>
              </article>
            ))}
          </div>

          <p>
            Não são só memórias. São a prova de que o que a gente tinha era real.
            <strong> E real não volta com arrependimento, volta com mudança.</strong>
            Eu sei disso. Estou aprendendo o peso disso.
          </p>
        </section>

        <section className="statement letter-block">
          <h2>
            O erro foi meu.
            <br />
            <span>Nunca foi seu.</span>
          </h2>
        </section>

        <VideoStrip videos={videoMoments.slice(2)} />

        <section className="letter-block">
          <Chapter title="V - o que eu ouvi de verdade" />
          <Quote text="É muito estranho como apesar de você ter me machucado tanto e tantas vezes, eu só consigo te desejar o bem." />
          <p>
            Essa frase me ensina algo sobre você que eu nunca soube apreciar como
            devia. <strong>A sua capacidade de amar não diminuiu com o que eu
            fiz.</strong> Ela é maior do que o que eu causei. E isso não é
            ingenuidade, é uma grandeza que eu não merecia.
          </p>
          <p>
            Você disse que sabe que eu sou o amor da sua vida, mas que não sou pra
            você. Eu precisei ouvir isso, não porque é o que eu queria ouvir, mas
            porque <em>é a coisa mais corajosa que você poderia ter dito.</em>
          </p>
          <p>
            Você tem razão: <strong>o amor não supera tudo. O amor não é o bastante.</strong>
            Eu acreditei que amar você seria suficiente pra não precisar mudar.
            Não é. Nunca foi. E entender isso tarde demais é o preço que estou
            pagando.
          </p>
        </section>

        <PhotoSpread photos={featuredPhotos.slice(6, 9)} caption="Foto, música e silêncio: tudo aqui é parte da mesma resposta." />

        <section className="final-letter letter-block">
          <Chapter title="VI - a carta que eu te devo" />
          <span className="salutation">Daiana,</span>
          <p>
            Você me pediu uma coisa só, no final de uma carta que tinha tudo o que
            poderia me partir ao meio. Uma coisa só: <em>"Só não minta mais pra
            mim, por favor."</em>
          </p>
          <p>
            Então aqui vai a única verdade que importa agora: <strong>eu errei.
            Profundamente. Repetidamente. E em alguns momentos, conscientemente.</strong>
            Não existe versão desse erro que seja pequena. Não existe desculpa que
            caiba. Não existe "mas" que alivie o peso do que eu fiz com alguém que
            me amou com tanta inteireza desde 2016.
          </p>
          <p>
            Você me disse que vai sofrer a cada ausência minha. Eu vou sofrer
            sabendo que fui eu quem causou essa ausência. Que eu tinha o café da
            manhã, a moto, a série, o banho, o amorzinho, e eu desperdicei.
            <strong> Não por falta de amor. Por excesso de covardia.</strong>
          </p>
          <p>
            Você escreveu que ninguém é totalmente bom nem totalmente mau. Eu me
            agarrei a essa frase. Não como desculpa, mas como compromisso.
            <em> A parte boa que existe em mim é, em grande parte, reflexo do que
            você acreditou que eu podia ser.</em> E eu pretendo honrar isso, não
            pra você me dar outra chance, mas porque você merece saber que o que
            você investiu em mim não foi em vão.
          </p>
          <p>
            Você tem o potencial de ser completamente feliz. Você disse isso sobre
            mim, mas eu devolvo essa frase pra você, que é quem realmente sabe o
            que significa ter vontade de desistir e ainda assim escolher a vida.
            <strong> Você vai florescer. Eu sei disso com uma certeza que não tenho
            sobre mais nada.</strong>
          </p>
          <p>
            Não vou mais mentir. Nem pra você, nem pra ninguém, nem pra mim mesmo.
            Essa é a única promessa que faço, não como negociação, não como pedido
            de retorno, mas como a coisa mais honesta que posso te oferecer hoje.
          </p>
          <p>
            <em>Feliz aniversário de vida, Daiana. Que os próximos anos sejam à
            altura de quem você é.</em>
          </p>

          <div className="assinatura">
            <span className="de">Com amor, com verdade, com respeito</span>
            <span className="nome">Luís Ricardo</span>
          </div>
        </section>

        <section className="gallery-letter letter-block">
          <Chapter title="VII - nossa história desde 2016" />
          <div className="gallery-grid">
            {galleryPhotos.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`Memória de Daiana e Luís ${index + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="letter-footer">
        <p>
          "Eu não tô pronta pra deixar você sair de vez da minha vida."
          <br />
          <em>Você disse isso. Eu ouvi. Desde 2016, eu sei o tamanho do que tivemos.</em>
        </p>
        <span>Daiana.</span>
      </footer>
    </div>
  );
}

function Chapter({ title }: { title: string }) {
  return <p className="chapter">{title}</p>;
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="big-quote">
      <p>"{text}"</p>
      <cite>- Daiana Lourenço</cite>
    </blockquote>
  );
}

function PhotoSpread({ photos, caption }: { photos: string[]; caption: string }) {
  return (
    <section className="photo-spread letter-block">
      <div className="photo-row">
        {photos.map((photo, index) => (
          <figure key={photo} className={`photo-card photo-${index + 1}`}>
            <img src={mediaPath(photo)} alt={`Memória de Daiana e Luís ${index + 1}`} loading="lazy" />
          </figure>
        ))}
      </div>
      <p>{caption}</p>
    </section>
  );
}

function VideoStrip({ videos }: { videos: string[] }) {
  return (
    <section className="video-strip letter-block">
      {videos.map((video) => (
        <video key={video} controls playsInline preload="metadata">
          <source src={mediaPath(video)} type="video/mp4" />
        </video>
      ))}
    </section>
  );
}

export default App;
