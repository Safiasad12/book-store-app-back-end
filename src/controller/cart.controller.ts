import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { addToCartService, emptyCartService, getCartDetailsService, removeItemService, updateQuantityService } from '../service/cart.service';



// export const addToCart = async (req: Request, res: Response): Promise<void> => {
//     try{

//     const data = await addToCartService(req.body.user_id, req.params.BookId)

//     res.status(HttpStatus.OK).json({
//       code : HttpStatus.OK,
//       data : data
//     })
//     }
//     catch(error: any){
//       res.status(HttpStatus.BAD_REQUEST).json({
//         code: HttpStatus.BAD_REQUEST,
//         error: error.message,
//       });
//     }
//   };


export const addToCart = async (req: Request, res: Response): Promise<any> => {


  try {
    const userId = req.body.user_id; // 🆕 Extract user ID from token middleware
    const { books } = req.body; // Only books array in request

    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        error: 'Books array is required',
      });
    }

    const data = await addToCartService(userId, books);

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data
    });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      error: error.message,
    });
  }
};




  export const removeItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await removeItemService(req.body.user_id, req.params.BookId);
  
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };


  export const updateQuantity = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const data = await updateQuantityService(
        req.body.user_id,
        req.params.BookId,
        req.body.quantityChange,
      );


      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  };




  export const getCartDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = await getCartDetailsService(req.body.user_id);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Cart Details',
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  };




  export const emptyCart = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = await emptyCartService(req.body.user_id);
     
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Cart Deleted Successfully',
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  };