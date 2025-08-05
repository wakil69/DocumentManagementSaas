import { z } from "zod";

export const getValidationSchemaFirstLogin = () => {
  return z
    .object({
      password: z
        .string()
        .min(12, "Le mot de passe doit contenir au moins 12 caractères")
        .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")
        .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre")
        .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir un caractère spécial"),

      confirmation_password: z
        .string()
        .min(1, "La confirmation du mot de passe est requise"),
    })
    .refine((data) => data.password === data.confirmation_password, {
      path: ["confirmation_password"],
      message: "Les mots de passe ne correspondent pas",
    });
};