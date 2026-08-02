import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
// import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  [x: string]: any;
  private readonly saltRounds = 12;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, fullName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword, fullName },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
        },
      });

      const { accessToken, refreshToken } = await this.generateTokens(
        user.id,
        user.email,
      );
      await this.updateRefreshToken(user.id, refreshToken);

      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error('Error during user registration', error);
      throw new InternalServerErrorException(
        'An error occurred during registration',
      );
    }
  }

  // Now a proper class method, not nested inside register()
  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        // secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        // secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // Update refresh token in the databsae
  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  // refresh tokens method

  async refreshTokens(userId: string): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        // refreshToken: true,
      },
    });

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user };
  }

  // Log out
  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // Log in
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      // select: {
      //   id: true,
      //   email: true,
      //   firstName: true,
      //   lastName: true,
      //   role: true,
      //   password: true,
      // },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Inavalid EMAIL or PASSWORD');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InternalServerErrorException('Invalid password');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
