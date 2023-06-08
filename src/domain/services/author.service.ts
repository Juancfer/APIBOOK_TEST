import bcrypt from "bcrypt";
import { type Request, type Response, type NextFunction } from "express";
import { generateToken } from "../../utils/token";
import { authorOdm } from "../odm/author.odm";
import fs from "fs";

export const getAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const authors = await authorOdm.getAllAuthors(page, limit);

    // Num total de elementos
    const totalElements = await authorOdm.getAuthorCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: authors,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getAuthorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const author = await authorOdm.getAuthorById(id);
    if (author) {
      res.json(author);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const getAuthorByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const name = req.params.name;

  try {
    const author = await authorOdm.getAuthorByName(name);
    if (author?.length) {
      res.json(author);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
};

export const createAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdAuthor = await authorOdm.createAuthor(req.body);
    res.status(201).json(createdAuthor);
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;

    if (req.author.id !== id && req.author.email !== "admin@gmail.com") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const authorDeleted = await authorOdm.deleteAuthor(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateAuthor = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;

    if (req.author.id !== id && req.author.email !== "admin@gmail.com") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const authorToUpdate = await authorOdm.getAuthorById(id);
    if (authorToUpdate) {
      Object.assign(authorToUpdate, req.body);
      await authorToUpdate.save();
      // Quitamos pass de la respuesta
      const authorToSend: any = authorToUpdate.toObject();
      delete authorToSend.password;
      res.json(authorToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Se deben especificar los campos email y password" });
      return;
    }

    const author: any = await authorOdm.getAuthorByEmailWithPassword(email);
    if (!author) {
      res.status(401).json({ error: "Email y/o contraseña incorrectos" });
      return;
    }

    // Comprueba la pass
    const authorPassword: string = author.password;
    const match = await bcrypt.compare(password, authorPassword);

    if (!match) {
      res.status(401).json({ error: "Email y/o contraseña incorrectos" });
      return;
    }

    // Generamos token JWT
    const jwtToken = generateToken(author._id.toString(), author.email);

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    next(error);
  }
};

const updateAuthorImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Renombrado de la imagen
    const originalname = req.file?.originalname as string;
    const path = req.file?.path as string;
    const newPath = `${path}_${originalname}`;
    fs.renameSync(path, newPath);

    // Busqueda de la marca
    const authorId = req.body.authorId;
    const author = authorOdm.getAuthorById(authorId) as any;

    if (author) {
      author.logoImage = newPath;
      const authorUpdated = await authorOdm.updateAuthor(authorId, author);
      res.json(authorUpdated);

      console.log("Autor modificada correctamente!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("Autor no encontrado");
    }
  } catch (error) {
    next(error);
  }
};

export const authorservice = {
  getAuthor,
  getAuthorById,
  getAuthorByName,
  createAuthor,
  deleteAuthor,
  updateAuthor,
  login,
  updateAuthorImage,
};
