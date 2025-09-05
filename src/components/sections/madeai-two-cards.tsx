"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
AnimatedCard,
CardBody,
CardDescription,
CardTitle,
CardVisual,
Visual2,
} from "@/components/ui/animated-card-diagram";

/**
* Hook simples para detectar quando o elemento entra na viewport (mobile)
* e aplicar uma animação de entrada (fade/translate) no wrapper do card.
* Não altera NADA no componente do card em si.
*/
function useInView<T extends HTMLElement>(threshold = 0.25) {
const ref = useRef<T | null>(null);
const [inView, setInView] = useState(false);

useEffect(() => {
if (!ref.current) return;
const el = ref.current;

if (typeof IntersectionObserver === "undefined") {
setInView(true);
return;
}

const io = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) setInView(true);
});
},
{ threshold }
);

io.observe(el);
return () => io.disconnect();
}, [threshold]);

return { ref, inView };
}

/**
* Seção: "Insights que provam valor" (você pode mudar o título no ponto de uso).
* - Desktop (md+): 2 cards lado a lado; animação interna por hover (já do componente).
* - Mobile: carrossel horizontal, cada card com fade/translate quando entrar na viewport.
* - Light/Dark: cores do Visual2 já respeitam o tema; cartões usam bg branco/preto do componente.
*
* IMPORTANTE: não altera o código do componente dos cards. Apenas o "wrap".
*/
export default function MadeAITwoCardsSection() {
// Card 1: "AI-as-Reviewer: até 60% mais rápido em triagem"
const card1 = useInView<HTMLDivElement>();
// Card 2: "Plataforma premiada / Reconhecimentos recentes"
const card2 = useInView<HTMLDivElement>();

return (
<section
aria-label="Key performance cards"
className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20"
>
{/* Cabeçalho opcional da seção */}
<div className="mb-8 flex items-end justify-between">
<h2 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
Insights que provam valor
</h2>
<div className="hidden text-sm text-neutral-500 dark:text-neutral-400 md:block">
Dados reais e reconhecimentos do mercado
</div>
</div>

{/* Desktop: 2 colunas */}
<div className="hidden gap-6 md:grid md:grid-cols-2">
{/* Card 1 */}
<AnimatedCard>
<CardVisual>
<Visual2 mainColor="#0ea5e9" secondaryColor="#22d3ee" />
</CardVisual>
<CardBody>
<CardTitle>AI-as-Reviewer acelera a triagem</CardTitle>
<CardDescription>
Reduza o tempo de{" "}
<span className="whitespace-nowrap">screening</span> em até 60%
mantendo transparência e rigor regulatório.
</CardDescription>
</CardBody>
</AnimatedCard>

{/* Card 2 */}
<AnimatedCard>
<CardVisual>
<Visual2 mainColor="#a78bfa" secondaryColor="#fbbf24" />
</CardVisual>
<CardBody>
<CardTitle>Plataforma premiada</CardTitle>
<CardDescription>
Reconhecida em 2024 e 2025 por inovação em GenAI para saúde —
validação independente do impacto e da qualidade.
</CardDescription>
</CardBody>
</AnimatedCard>
</div>

{/* Mobile: carrossel horizontal sem auto-play */}
<div
className="md:hidden"
role="region"
aria-label="Cards em carrossel"
>
<div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
{/* Slide 1 */}
<div
ref={card1.ref}
className={[
"snap-center shrink-0 transition-all duration-700",
"data-[inview=false]:translate-y-4 data-[inview=false]:opacity-0",
"data-[inview=true]:translate-y-0 data-[inview=true]:opacity-100",
].join(" ")}
data-inview={card1.inView}
>
<AnimatedCard className="shadow-md">
<CardVisual>
<Visual2 mainColor="#0ea5e9" secondaryColor="#22d3ee" />
</CardVisual>
<CardBody>
<CardTitle>AI-as-Reviewer acelera a triagem</CardTitle>
<CardDescription>
Reduza o tempo de{" "}
<span className="whitespace-nowrap">screening</span> em até
60% com validações claras em cada etapa.
</CardDescription>
</CardBody>
</AnimatedCard>
</div>

{/* Slide 2 */}
<div
ref={card2.ref}
className={[
"snap-center shrink-0 transition-all duration-700",
"data-[inview=false]:translate-y-4 data-[inview=false]:opacity-0",
"data-[inview=true]:translate-y-0 data-[inview=true]:opacity-100",
].join(" ")}
data-inview={card2.inView}
>
<AnimatedCard className="shadow-md">
<CardVisual>
<Visual2 mainColor="#a78bfa" secondaryColor="#fbbf24" />
</CardVisual>
<CardBody>
<CardTitle>Plataforma premiada</CardTitle>
<CardDescription>
Prêmios em 2024 e 2025 por excelência em GenAI — confiança de
mercado para operar em escala.
</CardDescription>
</CardBody>
</AnimatedCard>
</div>
</div>

{/* Dots de paginação manuais (não automáticos) */}
<div className="mt-4 flex justify-center gap-2">
<span className="h-1.5 w-6 rounded-full bg-neutral-300 dark:bg-neutral-700" />
<span className="h-1.5 w-6 rounded-full bg-neutral-200 dark:bg-neutral-800" />
</div>
</div>
</section>
);
}