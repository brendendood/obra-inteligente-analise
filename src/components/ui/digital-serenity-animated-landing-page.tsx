import React, { useState, useEffect, useRef } from 'react';

const DigitalSerenity = () => {
  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: '0px',
    top: '0px',
    opacity: 0,
  });
  const [ripples, setRipples] = useState<Array<{id:number,x:number,y:number}>>([]);
  const [scrolled, setScrolled] = useState(false);
  const wordsRef = useRef<HTMLElement[]>([]); // Not strictly necessary if not directly manipulating post-initial animation
  const floatingElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const animateWords = () => {
      const wordElements = document.querySelectorAll<HTMLElement>('.word-animate');
      wordElements.forEach(word => {
        const delay = parseInt(word.getAttribute('data-delay') || '0') || 0;
        setTimeout(() => {
          if (word) word.style.animation = 'word-appear 0.8s ease-out forwards';
        }, delay);
      });
    };
    const timeoutId = setTimeout(animateWords, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseGradientStyle({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        opacity: 1,
      });
    };
    const handleMouseLeave = () => {
      setMouseGradientStyle(prev => ({ ...prev, opacity: 0 }));
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  useEffect(() => {
    const wordElements = document.querySelectorAll<HTMLElement>('.word-animate');
    const handleMouseEnter = (e: Event) => { const t = e.target as HTMLElement | null; if (t) t.style.textShadow = '0 0 20px rgba(203, 213, 225, 0.5)'; };
    const handleMouseLeave = (e: Event) => { const t = e.target as HTMLElement | null; if (t) t.style.textShadow = 'none'; };
    wordElements.forEach(word => {
      word.addEventListener('mouseenter', handleMouseEnter);
      word.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      wordElements.forEach(word => {
        if (word) {
          word.removeEventListener('mouseenter', handleMouseEnter);
          word.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.floating-element-animate');
    floatingElementsRef.current = Array.from(elements);
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
        floatingElementsRef.current.forEach((el, index) => {
          setTimeout(() => {
            if (el) {
              el.style.animationPlayState = 'running';
              el.style.opacity = ''; 
            }
          }, (parseFloat(el.style.animationDelay || "0") * 1000) + index * 100);
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // -----------------------------
  // COUNTDOWN SECTION (IN-VIEW)
  // -----------------------------
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [targetDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // Demo: 14 dias a partir de agora
    d.setSeconds(d.getSeconds() + 5); // leve deslocamento para ver animações
    return d;
  });

  type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; };
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));

  function calcTimeLeft(target: Date): TimeLeft {
    const now = new Date().getTime();
    const distance = Math.max(0, target.getTime() - now);
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    if (!countdownRef.current) return;

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCountdownVisible(true);
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(countdownRef.current);
    } else {
      // Fallback: considerar visível
      setCountdownVisible(true);
    }

    return () => {
      if (observer && countdownRef.current) observer.unobserve(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (!countdownVisible) return;
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [countdownVisible, targetDate]);

  // Utilitário para quebrar em dígitos string com pad
  function toDigits(n: number, pad: number) {
    return n.toString().padStart(pad, '0').split('');
  }

  // CSS
  const pageStyles = `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px; /* rounded-full */
      background-image: radial-gradient(circle, rgba(156, 163, 175, 0.05), rgba(107, 114, 128, 0.05), transparent 70%); /* slate-400/5, slate-500/5 */
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out;
    }
    @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
    @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
    .word-animate { display: inline-block; opacity: 0; margin: 0 0.1em; transition: color 0.3s ease, transform 0.3s ease; }
    .word-animate:hover { color: #cbd5e1; /* slate-300 */ transform: translateY(-2px); }
    .grid-line { stroke: #94a3b8; /* slate-400 */ stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
    .detail-dot { fill: #cbd5e1; /* slate-300 */ opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
    .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
    .text-decoration-animate { position: relative; }
    .text-decoration-animate::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); animation: underline-grow 2s ease-out forwards; animation-delay: 2s; }
    @keyframes underline-grow { to { width: 100%; } }
    .floating-element-animate { position: absolute; width: 2px; height: 2px; background: #cbd5e1; border-radius: 50%; opacity: 0; animation: float 4s ease-in-out infinite; animation-play-state: paused; }
    @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } }
    .ripple-effect { position: fixed; width: 4px; height: 4px; background: rgba(203, 213, 225, 0.6); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; animation: pulse-glow 1s ease-out forwards; z-index: 9999; }

    /* COUNTDOWN styles (flip animation) */
    .countdown-wrapper { 
      position: relative;
      isolation: isolate;
    }
    .countdown-glow::before {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(148,163,184,0.25), rgba(30,41,59,0.2));
      filter: blur(12px);
      z-index: -1;
    }
    .time-box {
      position: relative;
      width: 64px;
      height: 84px;
      border-radius: 12px;
      background: rgba(2,6,23,0.35); /* slate-950/35 */
      border: 1px solid rgba(148,163,184,0.2); /* slate-400/20 */
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .time-label {
      letter-spacing: 0.15em;
    }
    .digit-stack {
      position: relative;
      perspective: 600px;
    }
    .digit {
      display: block;
      font-variant-numeric: tabular-nums;
      font-feature-settings: "tnum";
    }
    @keyframes flip-down {
      0% { transform: rotateX(0deg); opacity: 0.8; }
      49% { transform: rotateX(-90deg); opacity: 0.4; }
      50% { transform: rotateX(90deg); opacity: 0.4; }
      100% { transform: rotateX(0deg); opacity: 1; }
    }
    .digit-anim {
      animation: flip-down 600ms cubic-bezier(.2,.7,.2,1) both;
      transform-origin: center top;
      backface-visibility: hidden;
    }
    .countdown-enter {
      opacity: 0;
      transform: translateY(16px);
      filter: blur(6px);
    }
    .countdown-enter-active {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
      transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
    }
  `;

  // Controle de animação por dígito: sempre que o valor muda, ativa flip
  const [prev, setPrev] = useState<TimeLeft>(timeLeft);
  useEffect(() => {
    if (!countdownVisible) return;
    setPrev((p) => timeLeft);
  }, [timeLeft, countdownVisible]);

  const Digit = ({ value }: { value: string }) => {
    // adiciona classe de animação a cada mudança
    const [animKey, setAnimKey] = useState(0);
    useEffect(() => {
      setAnimKey(k => k + 1);
    }, [value]);
    return (
      <span className="digit text-4xl sm:text-5xl md:text-6xl font-light text-slate-100 digit-anim inline-block will-change-transform" key={animKey}>
        {value}
      </span>
    );
  };

  const Unit = ({ n, pad, label }: { n: number; pad: number; label: string }) => {
    const digits = toDigits(n, pad);
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="time-box countdown-glow">
          <div className="digit-stack flex gap-1 px-3">
            {digits.map((d, i) => (
              <Digit value={d} key={`${label}-${i}-${d}-${timeLeft.seconds}`} />
            ))}
          </div>
        </div>
        <span className="time-label text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-300/80">
          {label}
        </span>
      </div>
    );
  };

  return (
    <>
      <style>{pageStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-primary overflow-hidden relative">
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="gridReactDarkResponsive" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridReactDarkResponsive)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
          <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.05' }} />
          <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3s' }} />
          <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3.2s' }} />
          <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.4s' }} />
          <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.6s' }} />
          <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: '4s' }} />
        </svg>

        {/* Responsive Corner Elements */}
        <div className="corner-element-animate top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8" style={{ animationDelay: '4s' }}>
          <div className="absolute top-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8" style={{ animationDelay: '4.2s' }}>
          <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8" style={{ animationDelay: '4.4s' }}>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8" style={{ animationDelay: '4.6s' }}>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
        </div>

        <div className="floating-element-animate" style={{ top: '25%', left: '15%', animationDelay: '0.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '60%', left: '85%', animationDelay: '1s' }}></div>
        <div className="floating-element-animate" style={{ top: '40%', left: '10%', animationDelay: '1.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '75%', left: '90%', animationDelay: '2s' }}></div>

        {/* Responsive Main Content Padding */}
        <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-6 py-10 sm:px-8 sm:py-12 md:px-16 md:py-20">
          <div className="text-center">
            <h2 className="text-xs sm:text-sm font-mono font-light text-slate-300 uppercase tracking-[0.2em] opacity-80">
              <span className="word-animate" data-delay="0">Stillness</span>
              <span className="word-animate" data-delay="300">speaks.</span>
            </h2>
            <div className="mt-4 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 mx-auto"></div>
          </div>

          <div className="text-center max-w-5xl mx-auto relative">
            {/* Responsive Main Heading Sizes */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight text-slate-50 text-decoration-animate">
              <div className="mb-4 md:mb-6">
                <span className="word-animate" data-delay="700">Find</span>
                <span className="word-animate" data-delay="850">your</span>
                <span className="word-animate" data-delay="1000">center,</span>
              </div>
              {/* Responsive Secondary Heading Sizes & Added tracking-wide for letter spacing */}
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-thin text-slate-300 leading-relaxed tracking-wide">
                <span className="word-animate" data-delay="1400">where</span>
                <span className="word-animate" data-delay="1550">peace</span>
                <span className="word-animate" data-delay="1700">resides</span>
                <span className="word-animate" data-delay="1850">and</span>
                <span className="word-animate" data-delay="2000">clarity</span>
                <span className="word-animate" data-delay="2150">awakens</span>
                <span className="word-animate" data-delay="2300">within</span>
                <span className="word-animate" data-delay="2450">the</span>
                <span className="word-animate" data-delay="2600">soul.</span>
              </div>
            </h1>
            {/* Responsive Detail Line Offsets */}
            <div className="absolute -left-6 sm:-left-8 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-px bg-slate-300 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '3.2s' }}></div>
            <div className="absolute -right-6 sm:-right-8 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-px bg-slate-300 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '3.4s' }}></div>
          </div>

          <div className="text-center">
            <div className="mb-4 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 mx-auto"></div>
            <h2 className="text-xs sm:text-sm font-mono font-light text-slate-300 uppercase tracking-[0.2em] opacity-80">
              <span className="word-animate" data-delay="3000">Observe,</span>
              <span className="word-animate" data-delay="3200">accept,</span>
              <span className="word-animate" data-delay="3400">let</span>
              <span className="word-animate" data-delay="3550">go.</span>
            </h2>
            <div className="mt-6 flex justify-center space-x-4 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '4.2s' }}>
              <div className="w-1 h-1 bg-slate-300 rounded-full opacity-40"></div>
              <div className="w-1 h-1 bg-slate-300 rounded-full opacity-60"></div>
              <div className="w-1 h-1 bg-slate-300 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>

        {/* -----------------------------
            COUNTDOWN SECTION (only on view)
           ----------------------------- */}
        <section
          ref={countdownRef}
          aria-label="Countdown section"
          className={`relative z-10 px-6 sm:px-8 md:px-16 pb-14 md:pb-24 countdown-wrapper`}
        >
          <div className={`max-w-5xl mx-auto text-center ${countdownVisible ? 'countdown-enter-active' : 'countdown-enter'}`}>
            <div className="inline-flex items-center gap-2 opacity-80">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-slate-300">Upcoming</span>
              <span className="w-10 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-slate-300">Milestone</span>
            </div>

            <h3 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extralight tracking-tight text-slate-50">
              Quiet focus, <span className="text-slate-300">strong results</span>
            </h3>

            <p className="mt-3 text-sm sm:text-base text-slate-300/80 max-w-2xl mx-auto">
              The wait becomes practice. Every second refines clarity.
            </p>

            {/* Timer */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Unit n={timeLeft.days} pad={2} label="Days" />
              <span className="text-3xl sm:text-4xl md:text-5xl text-slate-400/60 -mt-2 sm:-mt-3">:</span>
              <Unit n={timeLeft.hours} pad={2} label="Hours" />
              <span className="text-3xl sm:text-4xl md:text-5xl text-slate-400/60 -mt-2 sm:-mt-3">:</span>
              <Unit n={timeLeft.minutes} pad={2} label="Minutes" />
              <span className="text-3xl sm:text-4xl md:text-5xl text-slate-400/60 -mt-2 sm:-mt-3">:</span>
              <Unit n={timeLeft.seconds} pad={2} label="Seconds" />
            </div>

            {/* Decorative line */}
            <div className="mt-8 w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 mx-auto" />

            {/* Sub-call */}
            <div className="mt-6 text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-slate-300/70">
              Stay present. The reveal arrives soon.
            </div>
          </div>
        </section>

        {/* Responsive Mouse Gradient Size & Blur */}
        <div 
          id="mouse-gradient-react"
          className="w-60 h-60 blur-xl sm:w-80 sm:h-80 sm:blur-2xl md:w-96 md:h-96 md:blur-3xl"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
            opacity: mouseGradientStyle.opacity,
          }}
        ></div>

        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple-effect"
            style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default DigitalSerenity;