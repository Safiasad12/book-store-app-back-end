import { Router } from "express";
import { userLogin, userRegistration } from "../controller/user.controller";
import { registrationValid, loginValid } from "../validator/user.validator";

const userRouter = Router();

userRouter.post("/register", registrationValid, userRegistration);
userRouter.post("/", loginValid, userLogin);

export default userRouter;


