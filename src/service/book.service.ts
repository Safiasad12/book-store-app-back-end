import Book from '../model/book.model';
import { IBook } from '../interface/book.interface';
import { IUser } from '../interface/user.interface';


export const createBookService = async (bookData: IBook, filePath: string | undefined): Promise<IBook> => {
  let bookImage = '';

  if (filePath) {
    bookImage = filePath;
  }

  const updatedBookData = { ...bookData, bookImage };
  const book = new Book(updatedBookData);
  const savedBook = await book.save();

  return savedBook;
};



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





  export const updateBookService = async (
    bookId: string,
    updateData: Partial<IUser>,
  ): Promise<IBook | void | null> => {
    const book = await Book.findById(bookId);
    if (!book) throw new Error('Book Not Exist');

    return await Book.findByIdAndUpdate(bookId, updateData, { new: true });
  };

 