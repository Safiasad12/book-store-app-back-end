
import { Router } from "express";

import userRouter from '../route/user.route';
import bookRouter from '../route/book.route';
import cartRouter from './cart.route';
import wishlistRouter from './wishlist.route';
import orderRouter from "./order.route";



export const handleRouter = (): Router => {
    const router = Router();

    router.use("/user", userRouter);
    router.use("/book", bookRouter);
    router.use("/cart", cartRouter);
    router.use("/wishlist", wishlistRouter);
    router.use("/order", orderRouter);

    return router;
}
