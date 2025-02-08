import User from '../model/user.model';
import { ICustomerDetails } from '../interface/customer-details.interface';
import CustomerDetails from '../model/customer-details.model';
import HttpStatus from 'http-status-codes';

export const addCustomerDetailService = async (
    userId: string,
    customerData: ICustomerDetails,
  ): Promise<ICustomerDetails> => {

    const isUser = await User.findById(userId);

    if(!isUser) throw new Error("User doesnt exist"); 

    const customerDetails = new CustomerDetails({...customerData, userId});
    await customerDetails.save();

    return customerDetails;
  };





  export const getCustomerDetailService = async (
    userId: string,
  ): Promise<{ code: number; data: ICustomerDetails[]; message: string }> => {
    const customerDetails = await CustomerDetails.find({ userId });

    if (customerDetails && customerDetails.length > 0)
      return {
        code: HttpStatus.ACCEPTED,
        data: customerDetails,
        message: 'Customer details successfully retrieved!',
      };
    else
      return {
        code: HttpStatus.BAD_REQUEST,
        data: [],
        message: 'Customer details not found!',
      };
  };
