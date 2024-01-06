import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { User } from 'src/schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { IQuery } from './user.interface';
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    getHashPassword = (password: string) => {
        if (password === null)
            return null
        const salt = genSaltSync(10)
        const hash = hashSync(password, salt)
        return hash
    }
    comparePassword = (password: string, hashedPassword: string) => {
        return compareSync(password, hashedPassword)
    }
    create = async (userDto: CreateUserDto) => {
        const { email, password, name, avatar, address, phoneNumber, role } = userDto
        const existUser = await this.userModel.findOne({ email })
        if (existUser) {
            throw new BadRequestException("Email has been used!")
        }
        const newUser = await this.userModel.create({
            email,
            password: this.getHashPassword(password),
            name,
            avatar,
            address,
            phoneNumber,
            role
        })
        return {
            _id: newUser._id,
            name: newUser.name,
            avatar: newUser?.avatar,
            address: newUser?.address,
            phoneNumber: newUser?.phoneNumber,
            role: newUser?.role
        }
    }
    createMany = async (userDto: CreateUserDto[]) => {

        for (let i = 0; i < userDto.length; i++) {
            const isExist = await this.userModel.findOne({ email: userDto[i].email })
            if (isExist) throw new BadRequestException(`${userDto[i].email} has been used!`)
        }
        userDto.forEach(user => {
            user.password = this.getHashPassword(user.password)
        })
        try {
            return await this.userModel.insertMany(userDto);
        } catch (err) {
            return err;
        }
    }
    update = (userDto: UpdateUserDto) => {
        return this.userModel.updateOne({
            _id: userDto._id
        }, {
            ...userDto
        })
    }
    delete = (_id: string) => {
        if (!Types.ObjectId.isValid(_id)) {
            throw new BadRequestException("Invalid id")
        }
        return this.userModel.deleteOne({ _id })
    }
    findById = (_id: string) => {
        if (!Types.ObjectId.isValid(_id)) {
            throw new BadRequestException("Invalid id")
        }
        return this.userModel.findById(_id).select('-password').exec()
    }
    findByEmail = (email: string) => {
        return this.userModel.findOne({ email })
    }
    setRefreshToken = (_id: Types.ObjectId, refreshToken: string) => {
        return this.userModel.updateOne({ _id }, { refreshToken })
    }
    findByToken(refreshToken: string) {
        return this.userModel.findOne({ refreshToken })
    }
    async findAllWithPaginate(current: number, pageSize: number, search: IQuery) {

        const defaultCurrent = current ? current : 1
        const defaultPageSize = pageSize ? pageSize : 2
        const offset = (defaultCurrent - 1) * defaultPageSize

        const totalItem = (await this.userModel.find({
            email: {
                $regex: search.email ? new RegExp(search.email) : "",
                $options: 'i'
            },
            name: {
                $regex: search.name ? new RegExp(search.name) : "",
                $options: 'i'
            },
        })).length
        const totalPage = Math.ceil(totalItem / defaultPageSize)
        const result = await this.userModel.find({
            email: {
                $regex: search.email ? new RegExp(search.email) : "",
                $options: 'i'
            },
            name: {
                $regex: search.name ? new RegExp(search.name) : "",
                $options: 'i'
            },
        }, null, {
            sort: {
                createdAt: search.sort && +search.sort === 1 ? 1 : -1
            }
        }).skip(offset).limit(defaultPageSize).select(['-password', '-refreshToken']).exec()
        return {
            current: defaultCurrent,
            pageSize: defaultPageSize,
            totalItem,
            totalPage,
            result
        }
    }
}
