import { Module } from '@nestjs/common';
import { Client } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      // PostgreSQL bağlantısını tek yerden sağlayıp servislerde inject ediyor.
      useValue: new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '2005',
        database: 'user_management',
      }),
    },
  ],
  exports: [PG_CONNECTION],
})
export class DbModule {}
