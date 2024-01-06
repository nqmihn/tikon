export type IUserDetail = {
    _id: string;
    email: string;
    name: string;
    phoneNumber: string;
    role: string;
    address?: string;
    createdAt: string;
}
export type IPostCreateManyUser = {
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    password: string;
}