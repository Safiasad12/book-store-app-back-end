import userRouter from '../route/user.route';
import bookRouter from '../route/book.route';

import { Router } from "express";

export const handleRouter = (): Router => {
    const router = Router();

    router.use("/user", userRouter);
    router.use("/book", bookRouter);

    return router;
}
