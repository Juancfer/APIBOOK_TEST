import { Author, type IAuthor } from "../entities/Author-entity";
import { type Document } from "mongoose";

const getAllAuthors = async (page: number, limit: number): Promise<any> => {
  return await Author.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getAuthorCount = async (): Promise<number> => {
  return await Author.countDocuments();
};

const getAuthorById = async (id: string): Promise<Document<IAuthor> | null> => {
  return await Author.findById(id);
};

const getAuthorByEmailWithPassword = async (email: string): Promise<Document<IAuthor> | null> => {
  const author: Document<IAuthor> | null = await Author.findOne({ email }).select("+password") as any;
  return author;
};

const getAuthorByName = async (name: string): Promise<Array<Document<IAuthor>>> => {
  return await Author.find({ firstName: new RegExp("^" + name.toLowerCase(), "i") });
};

const createAuthor = async (authorData: any): Promise<Document<IAuthor>> => {
  const author = new Author(authorData);
  const document: Document<IAuthor> = (await author.save()) as any;

  return document;
};

const deleteAuthor = async (id: string): Promise<Document<IAuthor> | null> => {
  return await Author.findByIdAndDelete(id);
};

const updateAuthor = async (id: string, authorData: any): Promise<Document<IAuthor> | null> => {
  return await Author.findByIdAndUpdate(id, authorData, { new: true, runValidators: true });
};

export const authorOdm = {
  getAllAuthors,
  getAuthorCount,
  getAuthorById,
  getAuthorByEmailWithPassword,
  getAuthorByName,
  createAuthor,
  deleteAuthor,
  updateAuthor,
};
