import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    // Önce kullanıcı adına göre ilgili kullanıcıyı buluyor.
    const user = await this.usersService.findAll()
      .then(users => users.find(u => u.username === username));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Listede şifre dönmediği için şifreyi veritabanından ayrıca alıyor.
    const raw = await this.usersService['db'].query(
      'SELECT password FROM users WHERE id = $1',
      [user.id],
    );

    const dbPassword = raw.rows[0].password;

    // Eski düz şifre kayıtları varsa onları da kontrol edebilmek için bu ayrımı yaptım.
    const passwordMatches = dbPassword.startsWith('$2')
      ? await bcrypt.compare(password, dbPassword)
      : dbPassword === password;

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Token içine kullanıcı id, kullanıcı adı ve rol bilgisini ekliyor.
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      access_token: token,
      user,
    };
  }
}
