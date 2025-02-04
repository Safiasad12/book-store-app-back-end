import User from '../model/user.model';
import { ICart } from '../interface/cart.interface';
import Cart from '../model/cart.model';
import Book from '../model/book.model';

export const addToCartService = async (
    userId: string,
    BookId: string
): Promise<ICart | null> => {
    const isUser = await User.findById(userId);

    if (!isUser) throw new Error('User doesnt exist');

    const cart = await Cart.findOne({ userId: userId });
    const bookDetails = await Book.findOne({
        _id: BookId,
        quantity: { $gt: 0 },
    });
    if (!bookDetails) throw new Error('Book doesnt exist');
    if (!cart) {
        const createdData = await Cart.create({
            userId: userId,
            totalPrice: bookDetails.price,
            totalDiscountPrice: bookDetails.discountPrice,
            totalQuantity: 1,
            books: [{ bookId: bookDetails._id, quantity: 1, bookName: bookDetails.bookName, author: bookDetails.author, bookImage: bookDetails.bookImage, price: bookDetails.price, discountPrice: bookDetails.discountPrice, description: bookDetails.description }],
        });
        console.log(createdData, "createdData")
        return createdData;
    }

    const book = cart.books.findIndex((book) => book.bookId === BookId);

    if (book !== -1) {
        if (cart.books[book].quantity + 1 > bookDetails.quantity)
            throw new Error('Out of Stock');

        const existData = await Cart.findOneAndUpdate(
            { userId: userId, 'books.bookId': BookId },
            {
                $inc: {
                    'books.$.quantity': 1,
                    totalPrice: bookDetails.price,
                    totalDiscountPrice: bookDetails.discountPrice,
                    totalQuantity: 1,
                },
            },
            { new: true },
        );
        return existData;
    } else {
        const newBook = await Cart.findOneAndUpdate(
            { userId: userId },
            {
                $inc: {
                    totalQuantity: 1,
                    totalPrice: bookDetails.price,
                    totalDiscountPrice: bookDetails.discountPrice,
                },
                $push: {
                    books: {
                        bookId: BookId,
                        quantity: 1,
                        bookName: bookDetails.bookName,
                        author: bookDetails.author,
                        bookImage: bookDetails.bookImage,
                        price: bookDetails.price,
                        discountPrice: bookDetails.discountPrice,
                        description: bookDetails.description
                    },
                },
            },
            { new: true },
        );
        return newBook;
    }
};




export const removeItemService = async (
    userId: string,
    bookId: string
  ): Promise<ICart | undefined> => {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) throw new Error('Cart not found');
  
    const existingBookIndex = cart.books.findIndex(
      (book: { bookId: string }) => book.bookId === bookId
    );
  
    if (existingBookIndex === -1) throw new Error('Book not found in cart');
 
    const bookDetails = await Book.findById(bookId);
    if (!bookDetails) throw new Error('Book details not found');
  
    const bookQuantity = cart.books[existingBookIndex].quantity;
  
    cart.books.splice(existingBookIndex, 1);
  
   
    cart.totalPrice -= bookDetails.price * bookQuantity;
    cart.totalDiscountPrice -= bookDetails.discountPrice * bookQuantity;
    cart.totalQuantity -= bookQuantity;  
  
   
    cart.totalPrice = Math.max(cart.totalPrice, 0);
    cart.totalDiscountPrice = Math.max(cart.totalDiscountPrice, 0);
    cart.totalQuantity = Math.max(cart.totalQuantity, 0);
  
    
    await cart.save();
  
    return cart;
  };
  