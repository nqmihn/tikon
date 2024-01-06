import { IsEmail, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail({}, { message: "Invalid Email!" })
    email: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    name: string

    @IsOptional()
    avatar: string

    @IsOptional()
    phoneNumber: string

    @IsOptional()
    address: string

    @IsOptional()
    role: string
}
export class UpdateUserDto {
    @IsNotEmpty()
    @IsMongoId()
    _id: mongoose.Schema.Types.ObjectId

    @IsOptional()
    email: string

    @IsOptional()
    name: string

    @IsOptional()
    role: string

    @IsOptional()
    address: string
}