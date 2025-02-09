import User from '../model/user.model';
import { ICustomerDetails } from '../interface/customer-details.interface';
import CustomerDetails from '../model/customer-details.model';
import HttpStatus from 'http-status-codes';
import redisClient from '../config/redisClient.config';

export const addCustomerDetailService = async (
    userId: string,
    customerData: ICustomerDetails,
  ): Promise<ICustomerDetails> => {

    const isUser = await User.findById(userId);

    if(!isUser) throw new Error("User doesnt exist"); 

    const customerDetails = new CustomerDetails({...customerData, userId});
    await customerDetails.save();

    await redisClient.del(`customerDetails:${userId}`);

    return customerDetails;
  };





  export const getCustomerDetailService = async (
    userId: string,
  ): Promise<{ code: number; data: ICustomerDetails[]; message: string }> => {

    const cachedCustomerDetails = await redisClient.get(`customerDetails:${userId}`);
    if (cachedCustomerDetails) {
        console.log('Customer details fetched from Redis');
        return {
            code: HttpStatus.ACCEPTED,
            data: JSON.parse(cachedCustomerDetails),
            message: 'Customer details successfully retrieved!',
        };
    }


    const customerDetails = await CustomerDetails.find({ userId });

    if (customerDetails && customerDetails.length > 0){

      await redisClient.setEx(`customerDetails:${userId}`, 300, JSON.stringify(customerDetails));

        console.log('Customer details fetched from MongoDB');
      
      return {
        code: HttpStatus.ACCEPTED,
        data: customerDetails,
        message: 'Customer details successfully retrieved!',
      };
    }
    else {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: [],
        message: 'Customer details not found!',
      };
  }
};



  export const updateCustomerDetailService = async (
    body: ICustomerDetails,
    customerId: string,
  ): Promise<{
    code: number;
    data: ICustomerDetails | null;
    message: string;
  }> => {

    const customerDetails = await CustomerDetails.findOne({_id: customerId });
    
    if (customerDetails) {
      customerDetails.name = body.name || customerDetails.name;
      customerDetails.mobileNumber = body.mobileNumber || customerDetails.mobileNumber;
      customerDetails.address = body.address || customerDetails.address;
      customerDetails.city = body.city || customerDetails.city;
      customerDetails.state = body.state || customerDetails.state;

      const updatedDetails = await customerDetails.save();

      await redisClient.del(`customerDetails:${customerDetails.userId}`);

      return {
        code: HttpStatus.ACCEPTED,
        data: updatedDetails,
        message: 'Customer details successfully updated!',
      };
    } else{
      return {
        code: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'Customer details not found!',
      };
    }
  };
