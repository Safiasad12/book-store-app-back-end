import { IUser } from "../interface/user.interface";
import User from "../model/user.model"; 
import {hash} from "../util/bcrypt.util";

export const registerUser = async (body: Record<string, any>): Promise<IUser> => {
    const userExist = await User.findOne({ email: body.email });
    if (userExist) {
        throw Error(`User with ${body.email} already exists`);
    }
    body.password = await hash(body.password);
    const userData = await User.create(body);

    return userData;
};

