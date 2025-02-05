import { Document } from 'mongoose';

export interface IWishList extends Document {
  userId: string;
  books: {
    bookId: string;
    bookName: string;
    author: string;
    price: number;
    bookImage: string;
    discountedPrice: number;
  }[];
}