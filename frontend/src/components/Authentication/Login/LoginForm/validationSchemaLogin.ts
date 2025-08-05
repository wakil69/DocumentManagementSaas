import { z } from "zod";

export const getValidationSchemaLogin = () => {
  return z.object({
    email: z
      .string()
      .email("Adresse email invalide")
      .min(1, "L'adresse email est requise"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis"),
  });
};