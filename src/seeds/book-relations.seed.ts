import mongoose from "mongoose";
import { mongoConnect } from "../domain/repositories/mongo-repository";
import { Book } from "../domain/entities/Book-entity";
import { Author } from "../domain/entities/Author-entity";
import { generateRandom } from "../utils/token";

const bookRelationsSeed = async (): Promise<void> => {
  try {
    await mongoConnect();
    console.log("Tenemos conexión!");

    // Recuperamos libros y autores
    const books = await Book.find();
    const authors = await Author.find();

    // Comprobar que existen libros
    if (!books.length) {
      console.error("No hay libros para relacionar en la base de datos");
      return;
    }

    if (!authors.length) {
      console.error("No hay usuarios para relacionar en la base de datos");
      return;
    }

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const randomAuthor = authors[generateRandom(0, authors.length - 1)];
      book.author = randomAuthor.id;
      await book.save();
    }

    console.log("Relaciones entre libros-autores creadas correctamente.");
  } catch (error) {
  } finally {
    await mongoose.disconnect();
  }
};

void bookRelationsSeed();
