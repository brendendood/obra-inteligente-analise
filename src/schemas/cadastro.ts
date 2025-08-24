import { z } from "zod";

export const senhaSchema = z.string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .regex(/[A-Z]/, "A senha deve ter pelo menos 1 letra maiúscula.")
  .regex(/[a-z]/, "A senha deve ter pelo menos 1 letra minúscula.")
  .regex(/[0-9]/, "A senha deve ter pelo menos 1 número.")
  .regex(/[^A-Za-z0-9]/, "A senha deve ter pelo menos 1 caractere especial.");

const passo1BaseSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: senhaSchema,
  confirmPassword: z.string()
});

export const passo1Schema = passo1BaseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem.",
  path: ["confirmPassword"]
});

export const passo2Schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  company: z.string().optional(),
  position: z.string().optional()
});

const passo3BaseSchema = z.object({
  acceptTerms: z.boolean()
});

export const passo3Schema = passo3BaseSchema.refine((data) => data.acceptTerms === true, {
  message: "Você deve aceitar os Termos de Uso e Política de Privacidade."
});

export const cadastroCompleteSchema = passo1BaseSchema.merge(passo2Schema).merge(passo3BaseSchema).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem.",
  path: ["confirmPassword"]
}).refine((data) => data.acceptTerms === true, {
  message: "Você deve aceitar os Termos de Uso e Política de Privacidade."
});