import userRouter from '../route/user.route';

import { Router } from "express";

export const handleRouter = (): Router => {
    const router = Router();

    router.use("/user", userRouter);

    return router;
}
