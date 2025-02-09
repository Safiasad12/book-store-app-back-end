import { IUser } from "../interface/user.interface";
import User from "../model/user.model"; 
import {hash, compare} from "../util/bcrypt.util";
import { accessSign, refreshSign, refreshVerify, resetSign } from "../util/jwt.util";
import { sendMail } from "../util/mail.util";

export const registerUser = async (body: Record<string, any>): Promise<IUser> => {
    const userExist = await User.findOne({ email: body.email });
    if (userExist) {
        throw Error(`User with ${body.email} already exists`);
    }
    body.password = await hash(body.password);
    const userData = await User.create(body);

    return userData;
};


export const loginUser = async (body: { email: string, password: string }): Promise<{ accessToken: string, refreshToken: string }> => {
    const userExist = await User.findOne({ email: body.email });
    if (!userExist) {
        throw Error(`no user exist with mail ${body.email}`);
    }
    const same = await compare(body.password, userExist.password);
    if(!same){
        throw Error('password did not match')
    }
    const accessToken = accessSign({ id: userExist._id, role: userExist.role });
    const refreshToken = refreshSign({ id: userExist._id, role: userExist.role });
    userExist.refreshToken = refreshToken;
    await userExist.save();
    return { accessToken, refreshToken };
}



export const forgotPasswordService = async (body: {email: string}): Promise<void> => {
    const userExist = await User.findOne({email: body.email});
    if(!userExist){
        throw Error(`user with ${body.email} doesn't exist`);
    }
    const resetToken = resetSign({id: userExist._id, role: userExist.role});
    await sendMail(body.email, 'Password Rest Token', `Your Password rest token is: ${resetToken}. Expires in 1 hour`)
}


export const resetPasswordService = async (body: {user_id: string, newPassword: string}) => {
    const userData = await User.findOne({_id: body.user_id});
    if(!userData) throw new Error ('user not exist');
    body.newPassword = await hash(body.newPassword);
    userData.password = body.newPassword;
    await userData.save();
}


export const refreshTokenService = async (body: { refreshToken: string }): Promise<string> => {
    const payload: any = refreshVerify(body.refreshToken);
    const userData = await User.findOne({_id: payload.id});
    if(!userData) throw new Error('User not exist');
    if (userData.refreshToken !== body.refreshToken) {
        throw Error(`given refresh token doesn't exist`);
    }
    const newToken = accessSign({ id: userData._id, role: userData.role });
    return newToken;
}