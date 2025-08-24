"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface TestimonialsColumnsProps {
  className?: string;
}

const testimonials: Testimonial[] = [
  {
    text: "A MadeAI revolucionou nossa gestão de projetos, deixando todos os processos de arquitetura mais rápidos e organizados.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Carla Mendes",
    role: "Gerente de Operações",
  },
  {
    text: "A implementação da MadeAI foi simples e eficiente. O time se adaptou rapidamente graças à interface intuitiva.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Lucas Pereira",
    role: "Coordenador de TI",
  },
  {
    text: "O suporte da MadeAI é excepcional. Eles nos acompanharam desde a configuração até a adaptação completa da equipe.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Fernanda Silva",
    role: "Líder de Suporte",
  },
  {
    text: "A integração com outras ferramentas melhorou nossa eficiência em todos os projetos. Recomendo para qualquer escritório de engenharia.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Eduardo Rocha",
    role: "CEO",
  },
  {
    text: "Os recursos robustos e a agilidade no atendimento transformaram nosso fluxo de trabalho.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Mariana Costa",
    role: "Gerente de Projetos",
  },
  {
    text: "A adoção da MadeAI foi além das expectativas. Os processos ficaram mais claros e nossa performance aumentou.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Juliana Oliveira",
    role: "Analista de Negócios",
  },
  {
    text: "Nossos clientes elogiam a clareza e a eficiência que conseguimos entregar graças às soluções da MadeAI.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Paulo Henrique",
    role: "Diretor de Marketing",
  },
  {
    text: "A plataforma realmente entende nossas necessidades. Hoje operamos de forma mais ágil e integrada.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Camila Andrade",
    role: "Gerente de Vendas",
  },
  {
    text: "Com a MadeAI, conseguimos aumentar nossa presença digital e melhorar a taxa de conversão de novos clientes.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Rafael Gomes",
    role: "Gestor de E-commerce",
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({
  testimonial,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
        "{testimonial.text}"
      </p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-foreground text-sm">
            {testimonial.name}
          </h4>
          <p className="text-muted-foreground text-xs">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const TestimonialsColumns: React.FC<TestimonialsColumnsProps> = ({
  className,
}) => {
  // Dividir testemunhos em 3 colunas
  const column1 = testimonials.filter((_, index) => index % 3 === 0);
  const column2 = testimonials.filter((_, index) => index % 3 === 1);
  const column3 = testimonials.filter((_, index) => index % 3 === 2);

  return (
    <section className={cn("py-20 bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra como profissionais e empresas estão transformando seus processos com a MadeAI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Coluna 1 */}
          <div className="space-y-6">
            {column1.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>

          {/* Coluna 2 */}
          <div className="space-y-6">
            {column2.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index + column1.length}
              />
            ))}
          </div>

          {/* Coluna 3 */}
          <div className="space-y-6">
            {column3.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index + column1.length + column2.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};