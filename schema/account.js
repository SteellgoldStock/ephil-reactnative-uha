import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Email invalide" }),
    password: z.string().min(8, { message: "Mot de passe trop court" }),
});

export const registerSchema = z.object({
    firstName: z.string().min(1, { message: "Nom trop court" }),
    lastName: z.string().min(1, { message: "Prénom trop court" }),
    email: z.email({ message: "Email invalide" }),
    password: z.string().min(8, { message: "Mot de passe trop court" }),
});

export const emailSchema = z.object({
  email: z.email({ message: "Email invalide" }),
});