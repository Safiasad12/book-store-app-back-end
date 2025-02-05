
import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { addToCart, emptyCart, getCartDetails, removeItem, updateQuantity } from "../controller/cart.controller";


const cartRouter = Router();


cartRouter.get('/', userAuth, getCartDetails);

cartRouter.delete('/', userAuth, emptyCart);

cartRouter.post('/:BookId', userAuth, addToCart);

cartRouter.put('/:BookId', userAuth, updateQuantity);

cartRouter.delete('/:BookId', userAuth, removeItem);




export default cartRouter;