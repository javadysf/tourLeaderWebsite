import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto, LoginDto, SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const OTP_STORE = new Map<string, { otp: string; expiresAt: Date }>();

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto.email && !dto.mobile) {
      throw new BadRequestException('ایمیل یا شماره موبایل الزامی است');
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.mobile ? { mobile: dto.mobile } : {},
        ],
      },
    });

    if (existing) {
      throw new ConflictException('کاربری با این مشخصات قبلاً ثبت‌نام کرده است');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        mobile: dto.mobile,
        passwordHash,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        role: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.role);
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    if (!dto.email && !dto.mobile) {
      throw new BadRequestException('ایمیل یا شماره موبایل الزامی است');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.mobile ? { mobile: dto.mobile } : {},
        ],
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('اطلاعات ورود اشتباه است');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('اطلاعات ورود اشتباه است');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('حساب کاربری شما غیرفعال است');
    }

    const tokens = await this.generateTokens(user.id, user.role);
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      ...tokens,
    };
  }

  async sendOtp(dto: SendOtpDto) {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    OTP_STORE.set(dto.mobile, { otp, expiresAt });

    // در محیط production اینجا SMS ارسال می‌شود
    console.log(`OTP for ${dto.mobile}: ${otp}`);

    return { message: 'کد تأیید ارسال شد' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const stored = OTP_STORE.get(dto.mobile);

    if (!stored || stored.otp !== dto.otp) {
      throw new BadRequestException('کد تأیید اشتباه است');
    }

    if (stored.expiresAt < new Date()) {
      OTP_STORE.delete(dto.mobile);
      throw new BadRequestException('کد تأیید منقضی شده است');
    }

    OTP_STORE.delete(dto.mobile);

    let user = await this.prisma.user.findUnique({ where: { mobile: dto.mobile } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          mobile: dto.mobile,
          firstName: '',
          lastName: '',
          mobileVerifiedAt: new Date(),
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { mobileVerifiedAt: new Date() },
      });
    }

    const tokens = await this.generateTokens(user.id, user.role);
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('توکن نامعتبر است');
    }

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('کاربر یافت نشد');
    }

    await this.prisma.refreshToken.delete({ where: { token } });
    return this.generateTokens(user.id, user.role);
  }

  async logout(userId: string, token?: string) {
    if (token) {
      await this.prisma.refreshToken.deleteMany({ where: { token } });
    } else {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }
    return { message: 'با موفقیت خارج شدید' };
  }

  private async generateTokens(userId: string, role: string) {
    const payload: JwtPayload = { sub: userId, role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = uuidv4();
    const refreshExpiresIn = this.configService.get('jwt.refreshExpiresIn', '7d');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: { userId, token: refreshToken, expiresAt },
    });

    return { accessToken, refreshToken };
  }
}
