
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { addCustomerDetailService, getCustomerDetailService } from '../service/customer-details.service';


export const addCustomerDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const customerDetails = await addCustomerDetailService(req.body.user_id, req.body);

      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'Customer Details added successfully',
        data: customerDetails,
      });
    } catch (error: any) {

      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };




  export const  getCustomerDetails =async(
    req: Request, 
    res: Response,
  ): Promise<void> => {
    try {
        const result = 
        await getCustomerDetailService(req.body.user_id);
        res.status(result.code).json({
            code: result.code,
            data: result.data,
            message: result.message,
        });
    } catch (error: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            data: null,
            message: error.message || 'An error occurred',
        });
    }
  };