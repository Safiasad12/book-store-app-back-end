import { Schema, model } from 'mongoose';
import { ICart } from '../interface/cart.interface';

const cartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalDiscountPrice: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    books: {
      type: [
        {
          bookId: { type: String, required: true },
          quantity: { type: Number, required: true },
          bookName: {
            type: String,
          },
          author: {
            type: String,
          },
          bookImage: {
            type: String,
            default: ''
          },
          price: {
            type: Number,
          },
          description: {
            type: String,
          },
          discountPrice: {
            type: Number,
          },
          admin_user_id: {
            type: String,
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

cartSchema.index({ userId: 1 }, { background: true });

export default model<ICart>('Cart', cartSchema);