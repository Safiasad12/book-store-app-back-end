import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { addToCartService } from '../service/cart.service';



export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try{

    const data = await addToCartService(req.body.user_id, req.params.BookId)

    res.status(HttpStatus.OK).json({
      code : HttpStatus.OK,
      data : data
    })
    }
    catch(error: any){
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  };