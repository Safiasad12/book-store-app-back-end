import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controller/wishlist.controller";

const wishlistRouter = Router();


wishlistRouter.get('/', userAuth, getWishlist);

wishlistRouter.post('/', userAuth, addToWishlist);

wishlistRouter.delete('/:BookId', userAuth, removeFromWishlist);



export default wishlistRouter;