"use client"

import { useEffect, useMemo, useRef, useState } from "react"

function daysSince(seedUtc: string) {
  const seed = new Date(seedUtc).getTime()
  const now = Date.now()
  const diffDays = Math.floor((now - seed) / (1000 * 60 * 60 * 24))
  return diffDays < 0 ? 0 : diffDays
}

function targetValues(seedUtc: string) {
  const d = daysSince(seedUtc)
  const users = 8 + Math.floor(d / 2) * 8      // +8 a cada 2 dias
  const projects = 12 + d * 8                   // +8 por dia
  const analyses = 5 + d * 5                    // +5 por dia
  return { users, projects, analyses }
}

function useCountUp(target: number, durationMs = 1000) {
  const [value, setValue] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    const start = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      setValue(Math.floor(p * target))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, durationMs])
  return value
}

export function CounterStats({
  seedUtc = "2025-09-01T00:00:00Z"
}: { seedUtc?: string }) {
  const targets = useMemo(() => targetValues(seedUtc), [seedUtc])
  const users = useCountUp(targets.users)
  const projects = useCountUp(targets.projects)
  const analyses = useCountUp(targets.analyses)

  const item = (label: string, val: number) => (
    <div className="flex flex-col items-center gap-1">
      <div className="text-4xl font-bold tabular-nums">{val}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )

  return (
    <section className="w-full bg-background text-foreground py-10">
      <div className="mx-auto max-w-container px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {item("Usuários ativos", users)}
        {item("Projetos ativos", projects)}
        {item("Análises concluídas", analyses)}
      </div>
    </section>
  )
}