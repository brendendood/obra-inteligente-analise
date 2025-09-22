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
  const projects = 850 + Math.floor(d / 2) * 3        // +3 projetos a cada 2 dias
  const savedHours = 15000 + d * 18                    // +18 horas economizadas por dia
  const savedMoney = 1200000 + d * 6500                // +R$ 6.500 economizados por dia
  return { projects, savedHours, savedMoney }
}

function useCountUpOnView(target: number, isVisible: boolean, durationMs = 2000) {
  const [value, setValue] = useState(0)
  const raf = useRef<number | null>(null)
  
  useEffect(() => {
    if (!isVisible) {
      setValue(0)
      return
    }
    
    const start = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      const easeOut = 1 - Math.pow(1 - p, 3) // Easing function for smooth animation
      setValue(Math.floor(easeOut * target))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, durationMs, isVisible])
  
  return value
}

export function CounterStats({
  seedUtc = "2025-09-01T00:00:00Z"
}: { seedUtc?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const targets = useMemo(() => targetValues(seedUtc), [seedUtc])
  
  const projects = useCountUpOnView(targets.projects, isVisible, 2000)
  const savedHours = useCountUpOnView(targets.savedHours, isVisible, 2200)
  const savedMoney = useCountUpOnView(targets.savedMoney, isVisible, 2400)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [isVisible])

  const item = (label: string, val: number | string, index: number) => (
    <div 
      className={`flex flex-col items-center gap-2 transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="relative flex flex-col items-center">
        <div className="text-4xl sm:text-5xl md:text-6xl font-bold tabular-nums text-primary text-center">
          {typeof val === 'number' ? val : val}
        </div>
        <div className={`absolute inset-0 rounded-lg bg-primary/10 blur-xl transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>
      <div className="text-sm sm:text-base text-muted-foreground font-medium text-center">
        {label}
      </div>
    </div>
  )

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-background text-foreground py-12 sm:py-16 overflow-hidden"
    >
      <div className="mx-auto max-w-container px-4">
        {/* Badge Live */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            LIVE
          </div>
        </div>
        
        {/* Título da seção */}
        <div className={`text-center mb-8 sm:mb-12 transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Insights que provam valor
          </h2>
          <p className="text-muted-foreground mt-2 text-base sm:text-lg">
            Números reais da transformação que proporcionamos
          </p>
        </div>
        
        {/* Contadores - Mobile horizontal, Desktop grid */}
        <div className="flex flex-row justify-center items-center gap-8 sm:gap-12 md:grid md:grid-cols-3 md:gap-6">
          {item("Projetos Analisados", projects.toLocaleString('pt-BR'), 0)}
          {item("Horas Economizadas", savedHours.toLocaleString('pt-BR'), 1)}
          {item("R$ Economizados", `R$ ${savedMoney.toLocaleString('pt-BR')}`, 2)}
        </div>
      </div>
    </section>
  )
}