import { Schema, model } from 'mongoose';
import { ICustomerDetails } from '../interface/customer-details.interface';

const customerDetailsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: null,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      ddefault: null,
      required: true,
    },
    state: {
      type: String,
      default: null,
      required: true,
    },
    city: {
      type: String,
      default: null,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ICustomerDetails>('CustomerDetails', customerDetailsSchema);