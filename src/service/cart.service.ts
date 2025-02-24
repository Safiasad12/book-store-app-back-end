import User from '../model/user.model';
import { ICart } from '../interface/cart.interface';
import Cart from '../model/cart.model';
import Book from '../model/book.model';
import redisClient from '../config/redisClient.config';

export const addToCartService = async (
    userId: string,
    books: { _id: string; quantity: number }[]
  ): Promise<ICart | null> => {
    try {
      console.log("Received Books from Frontend:", books);
  
      const isUser = await User.findById(userId);
      if (!isUser) throw new Error('User does not exist');
  
      let cart = await Cart.findOne({ userId });
  
      const bookDetailsList = await Book.find({
        _id: { $in: books.map(b => b._id) },
        quantity: { $gt: 0 },
      });
  
      console.log("Books found in DB:", bookDetailsList);
  
      if (!cart) {
        const createdCart = await Cart.create({
          userId,
          totalPrice: bookDetailsList.reduce((acc, book) => acc + book.price, 0),
          totalDiscountPrice: bookDetailsList.reduce((acc, book) => acc + book.discountPrice, 0),
          totalQuantity: books.reduce((acc, book) => acc + book.quantity, 0),
          books: bookDetailsList.map((book, index) => ({
            bookId: book._id,
            quantity: books[index].quantity,
            bookName: book.bookName,
            author: book.author,
            bookImage: book.bookImage,
            price: book.price,
            discountPrice: book.discountPrice,
            description: book.description,
          })),
        });
  
        console.log("New Cart Created:", createdCart);
        return createdCart;
      }
  
      console.log("Cart Before Update:", cart);
  
      let totalQuantity = cart.totalQuantity;
      let totalPrice = cart.totalPrice;
      let totalDiscountPrice = cart.totalDiscountPrice;
  
      for (const { _id, quantity } of books) {
        const bookIndex = cart.books.findIndex((b) => b.bookId.toString() === _id);
        const bookDetails = bookDetailsList.find((b) => b._id.toString() === _id);
  
        if (!bookDetails) continue;
  
        if (bookIndex !== -1) {
          if (cart.books[bookIndex].quantity + quantity > bookDetails.quantity) {
            throw new Error(`Book ${bookDetails.bookName} is out of stock`);
          }
  
          cart.books[bookIndex].quantity += quantity;
        } else {
          cart.books.push({
            bookId: bookDetails._id.toString(),
            quantity,
            bookName: bookDetails.bookName,
            author: bookDetails.author,
            bookImage: bookDetails.bookImage,
            price: bookDetails.price,
            discountPrice: bookDetails.discountPrice,
            description: bookDetails.description,
          });
        }
  
        totalQuantity += quantity;
        totalPrice += bookDetails.price * quantity;
        totalDiscountPrice += bookDetails.discountPrice * quantity;
      }
  
      cart.totalQuantity = totalQuantity;
      cart.totalPrice = totalPrice;
      cart.totalDiscountPrice = totalDiscountPrice;
  
      await cart.save();
      console.log("Cart After Save:", cart);
  
      await redisClient.del(`cart:${userId}`);
  
      return cart;
    } catch (error: any) {
      console.error("Error in addToCartService:", error);
      throw new Error(error.message || "Failed to add to cart");
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
  if (isNaN(quantityChange)) {
      throw new Error('Invalid quantityChange value');
  }

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

  console.log('Book Details:', bookDetails);
  console.log('Book Price:', bookDetails.price, 'Discount Price:', bookDetails.discountPrice);
  console.log('Quantity Change:', quantityChange);

  const existingBook = cart.books[bookIndex];
  const newQuantity = existingBook.quantity + quantityChange;

  if (newQuantity <= 0) {
      cart.books.splice(bookIndex, 1);

      cart.totalQuantity -= existingBook.quantity;
      cart.totalPrice -= existingBook.quantity * (Number(bookDetails.price) || 0);
      cart.totalDiscountPrice -= existingBook.quantity * (Number(bookDetails.discountPrice) || 0);

      if (cart.books.length === 0) {
          cart.totalPrice = 0;
          cart.totalDiscountPrice = 0;
          cart.totalQuantity = 0;
      }

      await cart.save();
      await redisClient.del(`cart:${userId}`);

      return cart;
  }

  if (newQuantity > bookDetails.quantity) {
      throw new Error('Not enough stock available for this book');
  }

  const bookPrice = Number(bookDetails.price) || 0;
  const discountPrice = Number(bookDetails.discountPrice) || 0;

  cart.books[bookIndex].quantity = newQuantity;
  cart.totalQuantity += quantityChange;
  cart.totalPrice += quantityChange * bookPrice;
  cart.totalDiscountPrice += quantityChange * discountPrice;

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

    // await redisClient.setEx(`cart:${userId}`, 300, JSON.stringify(cart));

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



