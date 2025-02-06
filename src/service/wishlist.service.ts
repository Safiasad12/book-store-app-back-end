import Wishlist from '../model/wishlist.model';
import Book from '../model/book.model';
import { IWishList } from '../interface/wishlist.interface';


export const addToWishlistService = async (
    userId: string,
    bookId: string,
  ): Promise<IWishList> => {
    const bookDetails = await Book.findById(bookId);

    if (!bookDetails) throw new Error('Book doesnt exist');

    let wishlist = await Wishlist.findOne({ userId: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        books: [
          {
            bookId: bookDetails._id.toString(),
            bookName: bookDetails.bookName,
            author: bookDetails.author,
            price: bookDetails.price,
            discountedPrice: bookDetails.discountPrice,
            bookImage: bookDetails.bookImage
          },
        ],
      });
      await wishlist.save();
    } else {
      const bookExists = wishlist.books.some(
        (book) => book.bookId.toString() === bookId,
      );

      if (!bookExists) {
        wishlist.books.push({
          bookId: bookDetails._id.toString(),
          bookName: bookDetails.bookName,
          author: bookDetails.author,
          price: bookDetails.price,
          bookImage: bookDetails.bookImage,
          discountedPrice: bookDetails.discountPrice,
        });
        await wishlist.save();
      } else throw new Error('Book already in wishlist');
    }

    return wishlist;
  };




  export const getWishlistService = async (
    userId: string
  ): Promise<IWishList> => {
    const wishlist = await Wishlist.findOne({ userId: userId });

    if (!wishlist) throw new Error('Wishlist not found'); 

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
    
        }
        else 
          throw new Error('WishList book does not exist!');
    };

