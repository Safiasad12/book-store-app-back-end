
import { Router } from "express";

import { getBooks } from "../controller/book.controller";

const bookRouter = Router();

bookRouter.get('/', getBooks);

export default bookRouter;