
import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { orderCart } from "../controller/order.controller";

const orderRouter = Router();


orderRouter.post('/', userAuth, orderCart);


export default orderRouter;