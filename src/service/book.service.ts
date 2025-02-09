import Book from '../model/book.model';
import { IBook } from '../interface/book.interface';
import { IUser } from '../interface/user.interface';
import redisClient from '../config/redisClient.config';


export const createBookService = async (bookData: IBook, filePath: string | undefined): Promise<IBook> => {
  let bookImage = '';

  if (filePath) {
    bookImage = filePath;
  }

  const updatedBookData = { ...bookData, bookImage };
  
  const book = new Book(updatedBookData);
  const savedBook = await book.save();

   // Clear books cache to ensure fresh data
   await redisClient.del('allBooks');

  return savedBook;
};


export const getAllBookService = async (
  page: number = 1, 
  limit: number = 10
): Promise<{ books: IBook[], totalBooks: number, totalPages: number, currentPage: number }> => {

  const cacheKey = `allBooks:page=${page}:limit=${limit}`;

  const cachedBooks = await redisClient.get(cacheKey);
  if (cachedBooks) {
    console.log('Cache hit');
    return JSON.parse(cachedBooks);
  }

  console.log('Cache miss, fetching from DB');

  const skip = (page - 1) * limit;
  const books = await Book.find().skip(skip).limit(limit);
  const totalBooks = await Book.countDocuments();

  if (books.length === 0) throw new Error('No Books Present');

  const totalPages = Math.ceil(totalBooks / limit);

  const result = {
    books,
    totalBooks,
    totalPages,
    currentPage: page
  };

  await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

  return result;
};


  export const getBookByIdService = async (bookId: string): Promise<IBook | null> => {

    const cacheKey = `book:${bookId}`;

    const cachedBook = await redisClient.get(cacheKey);
    if (cachedBook) {
      console.log('Cache hit');
      return JSON.parse(cachedBook);
    }
  
    const book = await Book.findById(bookId);

    if (!book) throw new Error('Book Not found');
    
    await redisClient.setEx(cacheKey, 300, JSON.stringify(book));

    console.log('Cache miss, fetching from DB');
    return book;
  };



  export const updateBookByIdService = async (
    bookId: string,
    updateData: Partial<IUser>,
  ): Promise<IBook | void | null> => {
    const book = await Book.findById(bookId);
    if (!book) throw new Error('Book Not Exist');


    // Clear cache for updated book
    await redisClient.del(`book:${bookId}`);
    await redisClient.del('allBooks');

    return await Book.findByIdAndUpdate(bookId, updateData, { new: true });

  };

 


  export const  deleteBookByIdService = async (bookId: string): Promise<void> => {
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) throw new Error('Book not found');
    else{
        // Remove cache entries
        await redisClient.del(`book:${bookId}`);
        await redisClient.del('allBooks');
    }
};