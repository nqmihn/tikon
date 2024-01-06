import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, User } from 'src/decorators/customize';
import { IUser } from 'src/user/user.interface';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { CreateUserDto } from 'src/dtos/user.dto';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UserService) { }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  handleLogin(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(user, response)
  }
  @Public()
  @Post('register')
  handleRegister(@Body() newUser: CreateUserDto) {
    return this.userService.create(newUser)
  }

  @Get('account')
  handleGetAccount(@User() user: IUser) {
    return user
  }
  @Post('logout')
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user, response)
  }
  @Post('refresh')
  @Public()
  handleRefresh(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
    const refreshToken = request.cookies["refresh_token"]
    return this.authService.processRefreshToken(response, refreshToken)
  }
  // @Public()
  // @Post('google/login')
  // async handleGoogleLogin(@Body('token') token: string) {

  //   const ticket = await oAuth2Client.verifyIdToken({
  //     idToken: token,
  //     audience: process.env.GOOGLE_CLIENT_ID
  //   })
  //   const user = ticket.getPayload()
  //   // return tokens
  //   return this.authService.loginByEmail(user.email, user.name, user.picture)
  // }
}
