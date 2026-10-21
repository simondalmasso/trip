import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ClusterAboutGlossy from "./components/ui/cluster-about-glossy-base";

type Dot = { x: number; y: number };

const routes = [
  { id: "clown", title: "CLOWN", number: "01", color: "#f2bd45", line: "El juego como punto de partida." },
  { id: "bufon", title: "BUFÓN", number: "02", color: "#f05a48", line: "Humor para mirar de costado." },
  { id: "mascaras", title: "MÁSCARAS", number: "03", color: "#b7a0ff", line: "Cuerpo, presencia y transformación." },
];

function makeLetterDots(): Dot[] {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 320;
  const context = canvas.getContext("2d");
  if (!context) return [];
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.font = '900 238px "Arial Black", Arial, sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("TRIP", 500, 160);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const dots: Dot[] = [];
  for (let y = 48; y < 290; y += 13) {
    for (let x = 55; x < 950; x += 12) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 110) dots.push({ x, y });
    }
  }
  const stride = Math.max(1, Math.ceil(dots.length / 280));
  return dots.filter((_, index) => index % stride === 0).slice(0, 280);
}

function seed(index: number, max: number) {
  const n = Math.sin(index * 127.1 + 17.7) * 43758.5453;
  return (n - Math.floor(n)) * max;
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const [dots, setDots] = useState<Dot[]>([]);
  const [showRoutes, setShowRoutes] = useState(Boolean(reduceMotion));

  useEffect(() => {
    setDots(makeLetterDots());
    if (reduceMotion) {
      setShowRoutes(true);
      return;
    }
    const timeout = window.setTimeout(() => setShowRoutes(true), 2550);
    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="webgl-wash" aria-hidden="true">
          <ClusterAboutGlossy
            background="#090909"
            count={42}
            merge={58}
            scale={150}
            palette="scatter"
            colors={["#f2bd45", "#f05a48", "#b7a0ff", "#f5eee4"]}
            speed={35}
            gather={4}
            hover={65}
          />
        </div>
        <header className="topbar">
          <a className="wordmark" href="#inicio" aria-label="TRIP, inicio">TRIP<span>®</span></a>
          <span className="topbar-note">TEATRO · LABORATORIO</span>
          <a className="topbar-link" href="#recorridos">EXPLORAR <span aria-hidden="true">↘</span></a>
        </header>

        <div className="hero-center" id="inicio">
          <p className="eyebrow">UN ESPACIO PARA JUGAR</p>
          <h1 id="hero-title" className="sr-only">TRIP Teatro Laboratorio</h1>
          <div className="bubble-stage" aria-hidden="true">
            <svg viewBox="0 0 1000 320" role="presentation">
              <defs>
                <radialGradient id="bubbleShine" cx="30%" cy="22%" r="75%">
                  <stop offset="0%" stopColor="#fff4d9" stopOpacity=".98" />
                  <stop offset="32%" stopColor="#f2bd45" stopOpacity=".94" />
                  <stop offset="100%" stopColor="#b95a31" stopOpacity=".86" />
                </radialGradient>
              </defs>
              {dots.map((dot, index) => (
                <motion.circle
                  key={index}
                  cx={dot.x}
                  cy={dot.y}
                  r={2.6 + seed(index, 2.6)}
                  fill={["url(#bubbleShine)", "#f05a48", "#b7a0ff", "#f5eee4"][index % 4]}
                  initial={reduceMotion ? { cx: dot.x, cy: dot.y, opacity: 0.9 } : {
                    cx: seed(index + 4, 1100) - 50,
                    cy: seed(index + 80, 450) - 65,
                    opacity: 0.08,
                  }}
                  animate={showRoutes && !reduceMotion
                    ? { cx: dot.x + seed(index + 101, 280) - 140, cy: dot.y + seed(index + 203, 190) - 95, opacity: 0, r: 1 }
                    : { cx: dot.x, cy: dot.y, opacity: 0.96 }}
                  transition={{ duration: reduceMotion ? 0 : showRoutes ? 1.05 : 1.85, delay: reduceMotion ? 0 : showRoutes ? seed(index, 0.22) : seed(index, 0.9), ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </svg>
            <motion.div
              className="trip-word"
              initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: showRoutes ? 0 : 1, scale: showRoutes ? 1.04 : 1 }}
              transition={{ duration: 0.8, delay: reduceMotion ? 0 : 1.3 }}
            >TRIP</motion.div>
          </div>
          <motion.p
            className="hero-subtitle"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: showRoutes ? 1 : 0, y: showRoutes ? 0 : 12 }}
            transition={{ duration: 0.7 }}
          >Un lugar para jugar a ser otro.</motion.p>
          <motion.div
            className="route-orbs"
            id="recorridos"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: showRoutes ? 1 : 0, y: showRoutes ? 0 : 24 }}
            transition={{ duration: 0.75, delay: reduceMotion ? 0 : 0.12 }}
          >
            {routes.map((route, index) => (
              <a className="route-orb-link" href={`#${route.id}`} key={route.id} aria-label={`Explorar ${route.title}`}>
                <motion.span
                  className="route-orb"
                  style={{ "--orb-color": route.color } as React.CSSProperties}
                  whileHover={reduceMotion ? undefined : { scale: 1.07, rotate: index % 2 ? -5 : 5 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <span className="orb-number">{route.number}</span>
                  <span className="orb-title">{route.title}</span>
                  <span className="orb-arrow" aria-hidden="true">↗</span>
                </motion.span>
              </a>
            ))}
          </motion.div>
        </div>

        <div className="hero-bottom">
          <span>SANTA FE, ARGENTINA</span>
          <span>IMPROVISACIÓN · CUERPO · JUEGO</span>
          <a href="#sobre-trip">CONOCER TRIP <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="intro section-pad" id="sobre-trip">
        <div className="section-index">00 / EL LABORATORIO</div>
        <div className="intro-copy">
          <p className="eyebrow">TEATRO PARA DESCUBRIR</p>
          <h2>No hace falta<br /><em>saber actuar.</em></h2>
          <p className="body-copy">Hace falta curiosidad, ganas de jugar y permiso para probar. TRIP es un espacio de exploración teatral donde el cuerpo, el humor y la imaginación abren caminos inesperados.</p>
        </div>
        <div className="intro-stamp" aria-hidden="true"><span>JUGAR</span><span>·</span><span>PROBAR</span><span>·</span><span>VOLVER</span></div>
      </section>

      <section className="routes-section section-pad">
        <div className="section-heading">
          <div className="section-index">01 / TRES RECORRIDOS</div>
          <p>Una puerta distinta para entrar al juego.</p>
        </div>
        {routes.map((route, index) => (
          <article className="route-row" id={route.id} key={route.id} style={{ "--route-color": route.color } as React.CSSProperties}>
            <span className="route-row-number">{route.number}</span>
            <div className="route-row-main">
              <h2>{route.title}</h2>
              <p>{route.line}</p>
            </div>
            <a className="route-row-link" href="https://www.instagram.com/trip.teatro.laboratorio/" target="_blank" rel="noreferrer" aria-label={`Consultar por ${route.title} en Instagram`}>
              <span>CONSULTAR</span><span aria-hidden="true">↗</span>
            </a>
            <span className="route-row-orb" aria-hidden="true" />
          </article>
        ))}
      </section>

      <footer className="footer section-pad">
        <div className="footer-top">
          <span className="eyebrow">TRIP · TEATRO LABORATORIO</span>
          <p>Tres puertas.<br /><em>Un mismo laboratorio.</em></p>
          <a className="footer-cta" href="https://www.instagram.com/trip.teatro.laboratorio/" target="_blank" rel="noreferrer">HABLEMOS <span aria-hidden="true">↗</span></a>
        </div>
        <div className="footer-bottom">
          <span>© TRIP TEATRO LABORATORIO</span>
          <div><a href="https://www.instagram.com/trip.teatro.laboratorio/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="https://www.facebook.com/trip.teatro.laboratorio" target="_blank" rel="noreferrer">FACEBOOK ↗</a></div>
          <a href="#inicio">VOLVER ARRIBA ↑</a>
        </div>
      </footer>
    </main>
  );
}
