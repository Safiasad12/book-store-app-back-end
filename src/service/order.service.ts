import User from '../model/user.model';
import Order from '../model/order.model';
import Book from '../model/book.model';
import Cart from '../model/cart.model';
import { IOrder } from '../interface/order.interface';
import { emptyCartService, getCartDetailsService } from './cart.service';


export const orderCartService = async (
    userId: string
  ): Promise<IOrder> => {
    const isUser = await User.findById(userId);

    if (!isUser) throw new Error('User doesnt exist');

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) throw new Error('No items to order yet');

    const cartDetails = await getCartDetailsService(userId);
    let checkStock = await Promise.all(
      cartDetails.books.map((data) =>
        Book.findOne(
          { _id: data.bookId, quantity: { $lt: data.quantity } },
          { _id: true },
        ),
      ),
    );

    checkStock = checkStock.filter(
      (book) => book !== undefined && book !== null,
    );

    if (checkStock.length > 0) throw new Error(`${checkStock} are out of stock`);

    const createdData: IOrder = await Order.create({
      userId: userId,
      cart: {
        totalPrice: cartDetails.totalPrice,
        totalDiscountPrice: cartDetails.totalDiscountPrice,
        totalQuantity: cartDetails.totalQuantity,
        books: cartDetails.books,
      },
    });

    createdData.cart.books.map(
      async (data) =>
        await Book.updateOne(
          { _id: data.bookId },
          { $inc: { quantity: -data.quantity } },
        ),
    );
    await emptyCartService(userId);

    return createdData;
  };




  export const getOrderDetailService = async (userId: string): Promise<IOrder[]> => {
    const orders = await Order.find({ userId: userId });
    // population
    const populatedOrders = await Order.populate(orders, {
      path: 'cart.books.bookId',
      select: 'bookName bookImage author price discountPrice',  
    });
    return populatedOrders.length ? populatedOrders : [];
};
