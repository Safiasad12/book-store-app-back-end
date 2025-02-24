import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getAllBookService, getBookByIdService, createBookService, updateBookByIdService, deleteBookByIdService } from "../service/book.service";



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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;

    const data = await getAllBookService(page, limit);

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





export const  updateBookById = async (req: Request, res: Response): Promise<void> => {

  const data = await updateBookByIdService(req.params.BookId, req.body);

  try {  
    res.status(HttpStatus.ACCEPTED).json({
      code: HttpStatus.ACCEPTED,
      data,
      message: 'Book Updated Successfully',
    });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      Error: error.message,
    });
  }
};



export const deleteBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      await deleteBookByIdService(req.params.BookId);

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Book deleted successfully',
    });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      Error: error.message,
    });
  }
};