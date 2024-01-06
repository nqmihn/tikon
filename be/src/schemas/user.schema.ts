import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    name: string;

    @Prop()
    avatar: string

    @Prop()
    phoneNumber: string

    @Prop({ default: "USER" })
    role: string

    @Prop()
    address: string

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date

    @Prop()
    refreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User);