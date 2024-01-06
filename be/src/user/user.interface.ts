import mongoose, { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId,
    email: string,
    name: string,
    avatar?: string
    role: string

}
export interface IQuery {
    name: string;
    email: string;
    sort: string;
}