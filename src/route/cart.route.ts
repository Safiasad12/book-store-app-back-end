
import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { addToCart, getCart, removeItem, updateQuantity } from "../controller/cart.controller";


const cartRouter = Router();


cartRouter.get('/', userAuth, getCart);

cartRouter.post('/:BookId', userAuth, addToCart);

cartRouter.delete('/:BookId', userAuth, removeItem);
                        
cartRouter.put('/:BookId', userAuth, updateQuantity);


export default cartRouter;