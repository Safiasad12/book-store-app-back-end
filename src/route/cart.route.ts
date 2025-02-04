
import { Router } from "express";

import { userAuth } from "../middleware/auth.middleware";
import { addToCart } from "../controller/cart.controller";

const cartRouter = Router();


cartRouter.post('/:BookId', userAuth, addToCart);

export default cartRouter;