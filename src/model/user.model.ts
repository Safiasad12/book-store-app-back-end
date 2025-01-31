import mongoose, { Schema } from "mongoose";
import { UserInterface } from '../interface/user.interface';


const UserSchema: Schema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model<UserInterface>("User", UserSchema);

export default User;
