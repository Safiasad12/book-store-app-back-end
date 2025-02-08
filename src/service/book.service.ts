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



export const getAllBookService = async (): Promise<[IBook[], number]> => {
  
  const cacheKey = 'allBooks';

   // Check cache
   const cachedBooks = await redisClient.get(cacheKey);
   if (cachedBooks) {
     console.log('Cache hit');
     return JSON.parse(cachedBooks);
   }

  console.log('Cache miss, fetching from DB');
  const books = await Book.find()

  if (books.length === 0) throw new Error('No Books Present');

  const totalBooks = await Book.countDocuments();

   // Store result in cache for 60 seconds
   await redisClient.setEx(cacheKey, 60, JSON.stringify([books, totalBooks]));

  return [books, totalBooks];
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
    
     // Cache the result for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(book));

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