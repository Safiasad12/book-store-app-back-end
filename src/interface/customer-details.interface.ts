import { Document } from 'mongoose';

export interface ICustomerDetails extends Document {
  userId: string;
  name: string;
  mobileNumber: string;
  address: string;
  state: string;
  city: string;
  country: string;
}