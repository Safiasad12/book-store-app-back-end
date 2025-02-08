import { Router } from "express";
import { forgotPassword, userLogin, userRegistration } from "../controller/user.controller";
import { registrationValid, loginValid } from "../validator/user.validator";

const userRouter = Router();

userRouter.post("/", loginValid, userLogin);
userRouter.post("/register", registrationValid, userRegistration);
userRouter.post("/forgot-password", forgotPassword);

export default userRouter;


