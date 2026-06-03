import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_CONNECTION') private db: Client) {}

  async findAll() {
    const result = await this.db.query('SELECT * FROM users');

    // Liste dönerken şifre bilgisini frontend'e göndermiyor.
    return result.rows.map(({ password, ...user }) => user);
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT id, username, full_name, role FROM users WHERE id = $1`,
      [id],
    );

    return result.rows[0];
  }

  async create(userData: {
    username: string;
    password: string;
    full_name: string;
    role: string;
  }) {
    if (!userData.username || !userData.password || !userData.full_name || !userData.role) {
      throw new BadRequestException('username, password, full_name and role are required');
    }

    // Yeni kullanıcı oluştururken şifreyi veritabanına hashlenmiş şekilde kaydediyor.
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const result = await this.db.query(
      `
      INSERT INTO users (username, password, full_name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, full_name, role
      `,
      [
        userData.username,
        hashedPassword,
        userData.full_name,
        userData.role,
      ],
    );

    return result.rows[0];
  }

  async update(
    id: number,
    userData: {
      username?: string;
      password?: string;
      full_name?: string;
      role?: string;
    },
  ) {
    const existing = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    const user = existing.rows[0];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Güncellemede şifre boş gelirse eski şifre korunur.
    const nextPassword = userData.password
      ? await bcrypt.hash(userData.password, 10)
      : user.password;

    const updatedUser = {
      username: userData.username ?? user.username,
      password: nextPassword,
      full_name: userData.full_name ?? user.full_name,
      role: userData.role ?? user.role,
    };

    const result = await this.db.query(
      `
      UPDATE users
      SET username = $1,
          password = $2,
          full_name = $3,
          role = $4
      WHERE id = $5
      RETURNING id, username, full_name, role
      `,
      [
        updatedUser.username,
        updatedUser.password,
        updatedUser.full_name,
        updatedUser.role,
        id,
      ],
    );

    return result.rows[0];
  }

  async remove(id: number) {
    // Silme işlemi id üzerinden yapılır.
    await this.db.query('DELETE FROM users WHERE id = $1', [id]);
    return { message: 'User deleted' };
  }
}
