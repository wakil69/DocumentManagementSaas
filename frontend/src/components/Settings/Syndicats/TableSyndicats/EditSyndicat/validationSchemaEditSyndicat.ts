import { z } from "zod";

export const getValidationEditSyndicat = () => {
  return z.object({
    syndicat_id: z.number(),
    categories: z.array(
      z.object({
        id: z.number(),
        name: z.string()
      })
    ),
  });
};