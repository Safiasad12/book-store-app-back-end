import Wishlist from '../model/wishlist.model';
import Book from '../model/book.model';
import { IWishList } from '../interface/wishlist.interface';
import redisClient from '../config/redisClient.config';

export const addToWishlistService = async (userId: string, bookIds: string[]): Promise<IWishList> => {
  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, books: [] });
  }

  for (const bookId of bookIds) {
    const bookDetails = await Book.findById(bookId);

    if (!bookDetails) {
      throw new Error(`Book with ID ${bookId} doesn't exist in book collection`);
    }

    const bookExists = wishlist.books.some((book) => book.bookId.toString() === bookId);

    if (!bookExists) {
      wishlist.books.push({
        bookId: bookDetails._id.toString(),
        bookName: bookDetails.bookName,
        author: bookDetails.author,
        price: bookDetails.price,
        discountedPrice: bookDetails.discountPrice,
        bookImage: bookDetails.bookImage
      });
    }
  }

  await wishlist.save();

  // Clear Redis cache after updating the wishlist
  await redisClient.del(`wishlist:${userId}`);

  return wishlist;
};




  export const getWishlistService = async (
    userId: string
  ): Promise<IWishList> => {

    const cachedWishlist = await redisClient.get(`wishlist:${userId}`);
    if (cachedWishlist) {
        console.log('Wishlist details fetched from Redis');
        return JSON.parse(cachedWishlist);
    }

    const wishlist = await Wishlist.findOne({ userId: userId });

    if (!wishlist) throw new Error('Wishlist not found'); 

    await redisClient.setEx(`wishlist:${userId}`, 300, JSON.stringify(wishlist));

    console.log('Wishlist details fetched from MongoDB');

    return wishlist;
  };




  export const removeFromWishlistService = async (
    userId: string,
    bookId: string
  ): Promise<IWishList | void> => {

        const wishList = await Wishlist.findOne({ userId: userId });
    
        if (!wishList) throw new Error('WishList does not exist!');
    
        const existingBook = wishList.books.find((book) => book.bookId === bookId);
    
        if (existingBook) {
          wishList.books = wishList.books.filter((book) => book.bookId !== bookId);
          await wishList.save();

          await redisClient.del(`wishlist:${userId}`);
    
        }
        else throw new Error('WishList book does not exist!');
    };

