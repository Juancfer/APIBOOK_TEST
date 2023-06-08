import { type NextFunction, type Response } from "express";
import { Author } from "../domain/entities/Author-entity";
import { verifyToken } from "./token";

export const isAuth = async (req: any, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    // Descodificamos el token
    const decodedInfo = verifyToken(token);
    const user = await Author.findOne({ email: decodedInfo.userEmail }).select("+password");
    if (!user) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.user = user;
    next();

    return null;
  } catch (error) {
    res.status(401).json(error);
    return null;
  }
};

module.exports = { isAuth };
