import { z } from "zod";

export const getValidationAddSyndicat = () => {
  return z.object({
    name: z
      .string()
      .min(1, "Le nom est requis"),
    categories: z.array(
      z.object({
        id: z.number(),
        name: z.string()
      })
    ),
  });
};