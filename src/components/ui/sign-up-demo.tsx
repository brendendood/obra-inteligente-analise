import { SignUpPage, Testimonial } from "@/components/ui/sign-up";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Ana Souza",
    handle: "@ana.dev",
    text: "O cadastro foi super rápido e fácil, já comecei a usar a plataforma na mesma hora."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Carlos Lima",
    handle: "@carlos.tech",
    text: "Adorei a experiência de cadastro em passos. Simples e intuitivo!"
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Bruno Ferreira",
    handle: "@bruno.design",
    text: "Nunca vi um signup tão bonito e funcional como o da MadeAI."
  },
];

export default function SignUpPageDemo() {
  const handleStep = (step: number, data: Record<string, any>) => {
    console.log("Step submitted:", step, data);
    alert(`Dados do passo ${step} enviados! Veja no console.`);
  };

  const handleGoogleSignUp = () => {
    alert("Google SignUp clicado");
  };

  return (
    <div className="bg-background text-foreground">
      <SignUpPage
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={sampleTestimonials}
        onSubmitStep={handleStep}
        onGoogleSignUp={handleGoogleSignUp}
      />
    </div>
  );
}