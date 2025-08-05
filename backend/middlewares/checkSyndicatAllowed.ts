import { NextFunction, Request, Response } from "express"
import { db } from "../db/knexConfig";

// check if admin
export const checkSyndicatAllowed = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.session.user_id;
  const { syndicat_id } = req.query

  const syndicat_allowed = await db('users_syndicats')
    .select()
    .where({ syndicat_id, user_id })
    .first();

  if (syndicat_allowed) {
    next()
  } else {
    res.status(401).json({
      message: "Vous n'avez pas les droits pour accéder à ce syndicat"
    })
    return
  }
}
