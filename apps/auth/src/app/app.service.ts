import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dtos/login.dto';
import { sign } from 'jsonwebtoken';
import { RegisterDTO } from './dtos/register.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(registerDTO: RegisterDTO) {
    const { email } = registerDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = new this.userModel(registerDTO);
    await newUser.save();
    return this.sanitizeUser(newUser);
  }

  async findByLogin(dto: LoginDTO) {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('user doesnt exists');
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new UnauthorizedException('invalid credential');
    }
  }

  async signPayload(payload: { id: string; email: string }) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
  }

  sanitizeUser(user: UserDocument) {
    const sanitized = user.toObject();
    delete sanitized.password;
    return sanitized;
  }
}
