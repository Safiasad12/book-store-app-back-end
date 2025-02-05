import userRouter from '../route/user.route';
import bookRouter from '../route/book.route';

import { Router } from "express";
import cartRouter from './cart.route';

export const handleRouter = (): Router => {
    const router = Router();

    router.use("/user", userRouter);
    router.use("/book", bookRouter);
    router.use("/cart", cartRouter)

    return router;
}
