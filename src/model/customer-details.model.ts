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
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ICustomerDetails>('CustomerDetails', customerDetailsSchema);