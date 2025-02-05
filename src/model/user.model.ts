import mongoose, { Schema } from "mongoose";
import { IUser } from '../interface/user.interface';


const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    }, 
    {
    timestamps: true
    }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
