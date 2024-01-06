import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from 'src/schemas/user.schema';
import { IUser } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, private configService: ConfigService) { }

    async validateUser(username: string, pass: string): Promise<User> | null {
        // const user = await this.usersService.findOne(username);
        // if (user && user.password === pass) {
        //     const { password, ...result } = user;
        //     return result;
        // }
        // return null;
        const user = await this.userService.findByEmail(username)
        if (user) {
            const isValidPassword = this.userService.comparePassword(pass, user.password)

            if (isValidPassword) {
                return user
            }
        }
        return null
    }
    createRefreshToken = (payload) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
            expiresIn: (this.configService.get<string>("REFRESH_TOKEN_EXPIRE"))
        });
        return refreshToken;
    }
    async login(user: IUser, response: Response) {
        const { _id, email, name, avatar, role } = user
        const payload = {
            sub: "login token",
            iss: "from server",
            _id,
            email,
            name,
            avatar,
            role

        };
        const refreshToken = this.createRefreshToken(payload)
        await this.userService.setRefreshToken(_id, refreshToken)
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: this.configService.get<number>("COOKIE_REFRESH_EXPIRE")
        })
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken,
            user: {
                _id,
                email,
                name,
                avatar,
                role
            }

        };
    }
    async logout(user: IUser, response: Response) {
        await this.userService.setRefreshToken(user._id, null)
        response.clearCookie("refresh_token")
        return "Logout Succeed!"
    }
    async processRefreshToken(response: Response, refreshToken: string) {
        try {
            const isFreshToken = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("REFRESH_TOKEN_SECRET")
            })
            const user = await this.userService.findByToken(refreshToken)
            if (!user) {
                throw new BadRequestException("Invalid Refresh Token. Please Login!")
            }
            const { _id, email, name, avatar, role } = user
            const payload = {
                sub: "login token",
                iss: "from server",
                _id,
                email,
                name,
                avatar,
                role

            };
            const refresh_token = this.createRefreshToken(payload)
            await this.userService.setRefreshToken(_id, refresh_token)
            response.clearCookie("refresh_token")
            response.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: this.configService.get<number>("COOKIE_REFRESH_EXPIRE")
            })
            return {
                accessToken: this.jwtService.sign(payload),
                refreshToken: refresh_token,
                user: {
                    _id,
                    email,
                    name,
                    avatar,
                    role
                }
            }



        } catch (error) {
            throw new BadRequestException("Invalid Refresh Token. Please Login!")
        }

    }
    // async loginByEmail(email: string, name: string, picture: string) {
    //     const user = await this.userService.findByEmail(email)
    //     if (user) {
    //         return this.login(user)

    //         // return this.login({ _id, email, name, avatar })
    //     } else {
    //         const newUser = await this.userService.create({ email, name, avatar: picture, password: null })
    //         return this.login(newUser)
    //     }
    // }
}