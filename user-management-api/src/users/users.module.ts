import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from '../db/db.module';

@Module({
  // Kullanıcı servisinin veritabanına ulaşabilmesi için DbModule burada kullanılıyor.
  imports: [DbModule],

  // Kullanıcı işlemlerinin endpointlerini UsersController karşılıyor.
  controllers: [UsersController],

  // Kullanıcı ekleme, silme, güncelleme gibi işlemler UsersService içinde.
  providers: [UsersService],

  // AuthService login sırasında kullanıcıları kontrol ettiği için bu servisi dışa açtım.
  exports: [UsersService],
})
export class UsersModule {}
