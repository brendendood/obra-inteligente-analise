"use client";

import { motion } from "framer-motion";

function buildPaths(position: number) {
  return Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    opacity: Math.min(0.12 + i * 0.02, 0.9),
  }));
}

function FloatingPaths({ position }: { position: number }) {
  const paths = buildPaths(position);

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* LIGHT MODE — linhas pretas */}
        <g className="dark:hidden" stroke="#000">
          {paths.map((p) => (
            <motion.path
              key={`l-${p.id}`}
              d={p.d}
              strokeWidth={p.width}
              strokeOpacity={p.opacity}
              initial={{ pathLength: 0.3, opacity: 0.6 }}
              animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </g>

        {/* DARK MODE — linhas brancas */}
        <g className="hidden dark:block" stroke="#fff">
          {paths.map((p) => (
            <motion.path
              key={`d-${p.id}`}
              d={p.d}
              strokeWidth={p.width}
              strokeOpacity={p.opacity}
              initial={{ pathLength: 0.3, opacity: 0.6 }}
              animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/** Apenas o background (sem títulos ou botões). */
export function BackgroundPaths() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-neutral-950">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}