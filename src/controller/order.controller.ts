
import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { orderCartService } from '../service/order.service';

export const orderCart = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try{
        const data = await orderCartService(req.body.user_id)

        res.status(HttpStatus.OK).json({
            code : HttpStatus.OK,
            data : data
        })
      }
    catch(error: any){
        res.status(HttpStatus.BAD_REQUEST).json({
            code : HttpStatus.BAD_REQUEST,
            error : error.message
        })
      }
    };