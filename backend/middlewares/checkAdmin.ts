import { NextFunction, Request, Response } from "express"
import { db } from "../db/knexConfig";

// check if admin
export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.session.user_id;

  const user = await db('users')
    .select('role')
    .where({ user_id })
    .first();

  if (user.role === "admin") {
    next()
  } else {
    res.status(401).json({
      message: "Vous n'avez pas les droits pour accéder à cette page"
    })
    return
  }
}
