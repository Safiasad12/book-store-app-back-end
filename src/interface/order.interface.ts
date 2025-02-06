import { Document } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  cart: {
    totalPrice: number;
    totalDiscountPrice: number;
    totalQuantity: number;
    books: {
      bookId: string;
      quantity: number;
    }[];
  };
}