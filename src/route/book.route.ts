
import { Router } from "express";
import { getAllBooks, getBookById, createBook, updateBookById, deleteBookById } from "../controller/book.controller";
import { validateBookId, validateCreateBook, validateUpdateBook } from "../validator/book.validator";
import { upload } from "../middleware/multer.middleware";
import { adminAuth } from "../middleware/auth.middleware";

const bookRouter = Router();


bookRouter.post('/', adminAuth, upload.single('bookImage'), createBook);
bookRouter.get('/', getAllBooks);
bookRouter.get('/:BookId', validateBookId, getBookById);
bookRouter.put('/:BookId', adminAuth, updateBookById);
bookRouter.delete('/:BookId', adminAuth, validateBookId, deleteBookById);


export default bookRouter;