
import { Router } from "express";
import { getAllBooks, getBookById, createBook, updateBookById } from "../controller/book.controller";
import { validateBookId, validateCreateBook } from "../validator/book.validator";
import { upload } from "../middleware/multer.middleware";
import { adminAuth } from "../middleware/auth.middleware";

const bookRouter = Router();


bookRouter.post('/', adminAuth, validateCreateBook, upload.single('bookImage'), createBook);
bookRouter.get('/', getAllBooks);
bookRouter.get('/:BookId', validateBookId, getBookById);
bookRouter.put('/:BookId', validateBookId, adminAuth, updateBookById);



export default bookRouter;