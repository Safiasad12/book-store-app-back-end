
import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { getOrderDetails, orderCart } from "../controller/order.controller";

const orderRouter = Router();


orderRouter.post('/', userAuth, orderCart);

orderRouter.get('/', userAuth, getOrderDetails);

export default orderRouter;