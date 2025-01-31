import { Router } from "express";
import { userRegistration } from "../controller/user.controller";
import { registrationValid } from "../validator/user.validator";

const userRouter = Router();

userRouter.post("/", registrationValid, userRegistration);

export default userRouter;
