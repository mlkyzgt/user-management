import { IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

// Güncellemede alanlar opsiyonel, sadece gelen alanlar kontrol edilir.
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Kullanıcı adı metin olmalıdır.' })
  @IsNotEmpty({ message: 'Kullanıcı adı boş bırakılamaz.' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Şifre metin olmalıdır.' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Ad-soyad metin olmalıdır.' })
  @IsNotEmpty({ message: 'Ad-soyad boş bırakılamaz.' })
  full_name?: string;

  @IsOptional()
  @IsIn(['ADMIN', 'USER'], { message: 'Rol sadece ADMIN veya USER olabilir.' })
  role?: string;
}
