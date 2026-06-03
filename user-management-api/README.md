# User Management API

Bu klasör, kullanıcı yönetim sisteminin NestJS ile geliştirilmiş backend uygulamasını içerir. API tarafında kullanıcı girişi, JWT authentication, rol bazlı yetkilendirme ve kullanıcı CRUD işlemleri bulunur.

## Kullanılan Teknolojiler

- Node.js
- NestJS
- PostgreSQL
- JWT
- bcrypt
- class-validator

## Kurulum

Backend klasörüne gidin:

```bash
cd user-management-api
```

Bağımlılıkları yükleyin:

```bash
npm install
```

Uygulamayı başlatın:

```bash
npm run start
```

Geliştirme modunda çalıştırmak için:

```bash
npm run start:dev
```

API varsayılan olarak aşağıdaki adreste çalışır:

```text
http://localhost:3000
```

## Veritabanı Ayarları

PostgreSQL bağlantısı `src/db/db.module.ts` içinde tanımlıdır.

Varsayılan bağlantı bilgileri:

```text
host: localhost
port: 5432
user: postgres
password: 2005
database: user_management
```

Veritabanında `users` tablosu bulunmalıdır.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role VARCHAR(20) NOT NULL
);
```

Geliştirme için örnek admin kullanıcı:

```sql
INSERT INTO users (username, password, full_name, role)
VALUES ('admin', '123456', 'Admin User', 'ADMIN');
```

Not: Yeni oluşturulan kullanıcıların şifreleri bcrypt ile hashlenerek kaydedilir. Login yapısı geliştirme kolaylığı için eski plain text şifreleri de kontrol edebilir.

## API Endpointleri

### Auth

```text
POST /auth/login
```

Request body:

```json
{
  "username": "admin",
  "password": "123456"
}
```

Başarılı cevap:

```json
{
  "access_token": "jwt_token",
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "Admin User",
    "role": "ADMIN"
  }
}
```

### Users

Kullanıcı endpointleri JWT token ile korunur.

```text
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

Authorization header:

```text
Authorization: Bearer jwt_token
```

Yetki durumu:

- `GET /users`: ADMIN ve USER erişebilir.
- `GET /users/:id`: Sadece ADMIN erişebilir.
- `POST /users`: Sadece ADMIN erişebilir.
- `PUT /users/:id`: Sadece ADMIN erişebilir.
- `DELETE /users/:id`: Sadece ADMIN erişebilir.

## Proje Yapısı

```text
src/
  auth/       Login, JWT guard ve rol kontrolü
  db/         PostgreSQL bağlantı modülü
  users/      Kullanıcı CRUD controller, service ve DTO dosyaları
  main.ts     Uygulama başlangıç dosyası
```

## Komutlar

Build almak için:

```bash
npm run build
```

Testleri çalıştırmak için:

```bash
npm run test
```

## Notlar

- CORS ayarı `http://localhost:4200` için açıktır.
- JWT secret geliştirme ortamı için kod içinde tanımlıdır.
- Gerçek ortamda veritabanı bilgileri ve JWT secret `.env` dosyası ile yönetilmelidir.
- Backend `3000` portunu kullanır. Bu port doluysa uygulama başlamaz.
