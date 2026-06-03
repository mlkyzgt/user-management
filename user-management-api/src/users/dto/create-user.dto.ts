import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Yeni kullanıcı oluştururken beklediğim alanlar ve validasyon kuralları.
export class CreateUserDto {
  @IsString({ message: 'Kullanıcı adı metin olmalıdır.' })
  @IsNotEmpty({ message: 'Kullanıcı adı boş bırakılamaz.' })
  username: string;

  @IsString({ message: 'Şifre metin olmalıdır.' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
  password: string;

  @IsString({ message: 'Ad-soyad metin olmalıdır.' })
  @IsNotEmpty({ message: 'Ad-soyad boş bırakılamaz.' })
  full_name: string;

  @IsIn(['ADMIN', 'USER'], { message: 'Rol sadece ADMIN veya USER olabilir.' })
  role: string;
}
