import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { getAllBookService, getBookByIdService } from "../service/book.service";



export const getAllBooks = async (req: Request, res: Response): Promise<void> => {

  try {
    const data = await getAllBookService();

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data,
      message: 'Books fetched successfully',
    });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      Error: error.message,
    });
  }
};


export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getBookByIdService(req.params.BookId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Book fetched successfully',
      data
    });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      Error: error.message,
    });
  }
};