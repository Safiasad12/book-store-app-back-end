import { Schema, model } from 'mongoose';
import { IWishList } from '../interface/wishlist.interface';

const wishListSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    books: {
      type: [
        {
          bookId: {
            type: String,
            required: true,
          },
          bookName: {
            type: String,
            required: true,
          },
          author: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          bookImage: {
            type: String,
            required: true,
          },
          discountedPrice: {
            type: Number,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

wishListSchema.index({ userId: 1 }, { background: true });

export default model<IWishList>('WishList', wishListSchema);


