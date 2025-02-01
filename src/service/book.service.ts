import Book from '../model/book.model';
import { IBook } from '../interface/book.interface';

export const getAllBookService = async (): Promise<[IBook[], number]> => {
  
  const books = await Book.find()

  if (books.length === 0) throw new Error('No Books Present');

  const totalBooks = await Book.countDocuments();

  return [books, totalBooks];
  };
