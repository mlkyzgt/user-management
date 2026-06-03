import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Endpoint üzerinde @Roles ile tanımlanan roller varsa burada okunur.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Rol şartı yoksa JWT'den geçen kullanıcı endpoint'e erişebilir.
    if (!requiredRoles) {
      return true;
    }

    // JwtGuard token içindeki kullanıcı bilgisini request'e ekliyor.
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User information not found');
    }

    // Kullanıcının rolü istenen roller arasında değilse işlem engellenir.
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
