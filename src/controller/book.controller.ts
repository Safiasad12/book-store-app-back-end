import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getAllBookService, getBookByIdService, createBookService } from "../service/book.service";



export const createBook = async (req: Request, res: Response): Promise<void> => {
  const data = await createBookService(req.body, req.file?.path);

  res.status(HttpStatus.CREATED).json({
    code: HttpStatus.CREATED,
    message: 'Book created successfully',
    data,
  });
};



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