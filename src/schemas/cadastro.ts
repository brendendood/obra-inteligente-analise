import { z } from "zod";

export const senhaSchema = z.string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .regex(/[A-Z]/, "A senha deve ter pelo menos 1 letra maiúscula.")
  .regex(/[a-z]/, "A senha deve ter pelo menos 1 letra minúscula.")
  .regex(/[0-9]/, "A senha deve ter pelo menos 1 número.")
  .regex(/[^A-Za-z0-9]/, "A senha deve ter pelo menos 1 caractere especial.");

export const passo1Schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: senhaSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem.",
  path: ["confirmPassword"]
});

export const passo2Schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  company: z.string().optional(),
  position: z.string().optional()
});

export const passo3Schema = z.object({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os Termos de Uso e Política de Privacidade."
  })
});

export const cadastroCompleteSchema = passo1Schema.merge(passo2Schema).merge(passo3Schema);