import { z } from "zod";

export const getValidationSchemaResetPwd = () => {
  return z
  .object({
    new_password: z
      .string()
      .min(12, "Le mot de passe doit contenir au moins 12 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")
      .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre")
      .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir un caractère spécial"),
    confirmation_new_password: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.new_password === data.confirmation_new_password, {
    path: ["confirmation_password"],
    message: "Les mots de passe ne correspondent pas",
  });

};