# User Management UI

Bu klasör, kullanıcı yönetim sisteminin Angular ile geliştirilmiş frontend uygulamasını içerir. Uygulama, NestJS backend API ile haberleşerek login, kullanıcı listeleme ve admin işlemlerini yönetir.

## Kullanılan Teknolojiler

- Angular
- TypeScript
- Angular Router
- Angular Forms
- HttpClient

## Kurulum

Frontend klasörüne gidin:

```bash
cd user-management-ui
```

Bağımlılıkları yükleyin:

```bash
npm install
```

Uygulamayı başlatın:

```bash
npm run start
```

Frontend varsayılan olarak aşağıdaki adreste çalışır:

```text
http://localhost:4200
```

## Backend Bağlantısı

Frontend, API isteklerini aşağıdaki backend adresine gönderir:

```text
http://localhost:3000
```

Bu adres `src/app/services/api.ts` içinde `baseUrl` olarak tanımlıdır.

## Özellikler

- Kullanıcı adı ve şifre ile giriş
- JWT token bilgisini localStorage içinde saklama
- Kullanıcı listesini görüntüleme
- Admin için kullanıcı ekleme
- Admin için kullanıcı güncelleme
- Admin için kullanıcı silme
- Admin için kullanıcı detayı görüntüleme
- Rol bazlı arayüz kontrolü
- Kullanıcı arama ve rol filtresi
- Üst bildirim sistemi
- Kullanıcı listesini Excel formatında dışa aktarma

## Ekranlar

### Login Ekranı

Kullanıcı adı ve şifre ile giriş yapılır. Başarılı girişten sonra kullanıcı yönetimi ekranına yönlendirme yapılır.

### Kullanıcı Yönetimi Ekranı

Admin kullanıcılar ekleme, güncelleme, silme ve detay görüntüleme işlemlerini yapabilir. Standart kullanıcılar sadece listeleme ekranını görür.

## Ekran Görüntüleri

### Admin Ekranı

![Admin Ekranı](screenshots/admin-page.png)

### Standart Kullanıcı Ekranı

![Standart Kullanıcı Ekranı](screenshots/user-page.png)

## Proje Yapısı

```text
src/
  app/
    pages/
      login/      Login ekranı
      users/      Kullanıcı yönetimi ekranı
    services/     API servisleri
    auth-guard.ts Route koruması
    app.routes.ts Sayfa route tanımları
  styles.css      Genel stil dosyası
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

- Frontend `4200` portunu kullanır.
- Login sonrası token ve kullanıcı bilgisi localStorage içinde saklanır.
- Excel export işlemi ekranda görünen filtrelenmiş liste üzerinden yapılır.
