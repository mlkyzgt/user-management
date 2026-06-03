import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Controller veya endpoint üzerinde hangi rollerin izinli olduğunu belirtmek için kullandım.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
