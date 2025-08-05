import { z } from "zod";

export const getValidationSchemaPwdForgotten = () => {
  return z.object({
    email: z
      .string()
      .email("Adresse email invalide")
      .min(1, "L'adresse email est requise")
  });
};