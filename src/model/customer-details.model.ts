import { Schema, model } from 'mongoose';
import { ICustomerDetails } from '../interface/customer-details.interface';

const customerDetailsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    mobileNumber: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ICustomerDetails>('CustomerDetails', customerDetailsSchema);