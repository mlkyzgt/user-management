import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login endpointi başarılı olursa token ve kullanıcı bilgisi döner.
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    // Formdan gelen kullanıcı adı ve şifreyi servise gönderiyor.
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}
