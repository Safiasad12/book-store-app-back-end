import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { addToWishlistService } from "../service/wishlist.service";

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