
import { Router } from "express";

import { getAllBooks, getBookById } from "../controller/book.controller";

import { validateBookId } from "../validator/book.validator";

const bookRouter = Router();



bookRouter.get('/', getAllBooks);
bookRouter.get('/:BookId', validateBookId, getBookById);


export default bookRouter;