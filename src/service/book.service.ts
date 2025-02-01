import Book from '../model/book.model';
import { IBook } from '../interface/book.interface';

export const getAllBookService = async (): Promise<[IBook[], number]> => {
  
  const books = await Book.find()

  if (books.length === 0) throw new Error('No Books Present');

  const totalBooks = await Book.countDocuments();

  return [books, totalBooks];
  };


  export const getBookByIdService = async (bookId: string): Promise<IBook | null> => {
    const book = await Book.findById(bookId);
    if (!book) throw new Error('Book Not found');
    else return book;
  };
