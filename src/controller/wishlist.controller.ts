import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { addToWishlistService, getWishlistService, removeFromWishlistService } from "../service/wishlist.service";


export const addToWishlist = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {

      const wishlist = await addToWishlistService (req.body.user_id, req.params.BookId);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Book added to wishlist successfully',
        data: wishlist,
      });
      
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };


  export const getWishlist = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const wishlist = await getWishlistService(req.body.user_id);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Wishlist retrieved successfully',
        data: wishlist,
      });
    } catch (error: any) {
      res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  };




  export const removeFromWishlist = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const wishlist =
      await removeFromWishlistService(req.body.user_id, req.params.BookId);
  
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Book Removed From wishlist successfully',
        data: wishlist,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };
