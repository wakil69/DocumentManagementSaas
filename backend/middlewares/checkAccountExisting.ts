import { NextFunction, Request, Response } from "express";
import { db } from "../db/knexConfig";

// check in the database that the account exist
export const checkAccountExisting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await db('users')
      .select('user_id')
      .where({ email })
      .first();

    if (!user) {
      res.status(200).json({ message: "Vous n'avez pas de compte associé à cette adresse mail" });
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
    return
  }
};