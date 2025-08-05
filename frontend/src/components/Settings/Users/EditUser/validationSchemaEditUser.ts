import { z } from "zod";

export const getValidationEditUser = () => {
  return z.object({
    user_id: z.number(),
    civilite: z.string().optional(),
    surname: z
      .string()
      .min(1, "Le prénom est requis"),
    first_name: z
      .string()
      .min(1, "Le prénom est requis"),
    email: z
      .string()
      .email("Adresse email invalide")
      .min(1, "L'email est requis"),
    role: z.enum(["admin", "user"]),
    syndicats: z.array(
      z.object({
        id: z.number(),
        name: z.string()
      })
    ),
  });
};