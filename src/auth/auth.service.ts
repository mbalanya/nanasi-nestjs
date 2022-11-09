import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, SignInDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // generate the password hash
    const password = await argon.hash(dto.password);

    // save new user to db
    try {
      const user = await this.prisma.user.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          email: dto.email,
          password,
          is_admin: dto.is_admin,
          image_url: dto.image_url,
        },
      });

      delete user.password;

      // return the saved user
      return this.signToken(user.user_id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken!');
        }
      }
      throw error;
    }
  }

  async signin(singindto: SignInDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: singindto.email,
      },
    });
    // if user does not exist throw error
    if (!user) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    // compare password
    const comparePassword = await argon.verify(
      user.password,
      singindto.password,
    );
    // if password incorrect throw error
    if (!comparePassword) {
      throw new ForbiddenException('Credentials Incorrect!');
    }

    // send back user
    delete user.password;
    return this.signToken(user.user_id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '720m',
      secret: secret,
    });

    return { access_token: token };
  }
}
