import { Controller, Post, Get, Body } from '@nestjs/common';

import { AppService } from './app.service';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.appService.findByLogin(loginDTO);
    const token = await this.appService.signPayload({
      id: user._id.toString(),
      email: user.email,
    });
    return {
      token,
      user,
    };
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    const user = await this.appService.create(registerDTO);
    const payload = {
      id: user._id.toString(),
      email: user.email,
    };

    const token = await this.appService.signPayload(payload);
    return { user, token };
  }
}
