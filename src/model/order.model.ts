import { Schema, model } from 'mongoose';
import { IOrder } from '../interface/order.interface';

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    cart: {
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
      books: [
        {
          bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
          quantity: { type: Number, required: true },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ userId: 1 }, { background: true });

export default model<IOrder>('Order', orderSchema);