import User from '../model/user.model';
import { ICart } from '../interface/cart.interface';
import Cart from '../model/cart.model';
import Book from '../model/book.model';
import redisClient from '../config/redisClient.config';

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

        await redisClient.del(`cart:${userId}`);

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

    await redisClient.del(`cart:${userId}`);

    return cart;
};





export const updateQuantityService = async (
    userId: string,
    BookId: string,
    quantityChange: number,
): Promise<ICart> => {
    const isUser = await User.findById(userId);
    if (!isUser) throw new Error('User doesnt exist');

    const cart = await Cart.findOne({ userId: userId });
    if (!cart) throw new Error('Cart not found');

    const bookIndex = cart.books.findIndex(
        (book) => book.bookId.toString() === BookId.toString(),
    );
    if (bookIndex === -1) throw new Error('Book not found in cart');

    const bookDetails = await Book.findOne({ _id: BookId });
    if (!bookDetails) throw new Error('Book not found');

    const existingBook = cart.books[bookIndex];
    const newQuantity = existingBook.quantity + quantityChange;

    if (newQuantity <= 0) {
        cart.books.splice(bookIndex, 1);

        cart.totalQuantity -= existingBook.quantity;
        cart.totalPrice -= existingBook.quantity * bookDetails.price;
        cart.totalDiscountPrice -=
            existingBook.quantity * bookDetails.discountPrice;

        if (cart.books.length === 0) {
            cart.totalPrice = 0;
            cart.totalDiscountPrice = 0;
            cart.totalQuantity = 0;
        }

        await cart.save();

        await redisClient.del(`cart:${userId}`);

        return cart;
    }


    if (quantityChange > 0 && newQuantity > bookDetails.quantity)
        throw new Error('Not enough stock available for this book');


    cart.books[bookIndex].quantity = newQuantity;
    cart.totalQuantity += quantityChange;
    cart.totalPrice += quantityChange * bookDetails.price;
    cart.totalDiscountPrice += quantityChange * bookDetails.discountPrice;

    await cart.save();

    await redisClient.del(`cart:${userId}`);

    return cart;
};



export const getCartDetailsService = async (userId: string): Promise<ICart> => {

    const cachedCart = await redisClient.get(`cart:${userId}`);
    if (cachedCart) {
        console.log('cart details fetched from Redis');
        return JSON.parse(cachedCart);
    }

    const cart = await Cart.findOne({ userId: userId });

    if(!cart){
        throw new Error("no cart for this user")
    }

    await redisClient.setEx(`cart:${userId}`, 300, JSON.stringify(cart));

    console.log("cart details fetched from mongo db")
    return cart;
};



export const emptyCartService = async (
    userId: string
  ): Promise<ICart | void> => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('User doesnt have Cart');
    await Cart.deleteOne({ userId });
    await redisClient.del(`cart:${userId}`);
  };



