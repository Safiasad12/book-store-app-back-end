import { Document } from 'mongoose';

export interface ICart extends Document {
  userId: string;
  totalPrice: number;
  totalDiscountPrice: number;
  totalQuantity: number;
  books: {
    bookId: string;
    quantity: number;
  }[];
}