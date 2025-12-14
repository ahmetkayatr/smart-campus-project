# Smart Campus Backend API

## 📋 Proje Açıklaması

Akıllı Kampüs Ekosistem Yönetim Platformu'nun backend API'si. Node.js, Express ve PostgreSQL kullanılarak geliştirilmiştir.

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ LTS
- PostgreSQL 14+
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**

```bash
npm install
```

2. **.env dosyasını oluşturun:**

```bash
copy .env.example .env
```

3. **PostgreSQL veritabanını oluşturun:**

```sql
CREATE DATABASE smart_campus_db;
```

4. **.env dosyasını düzenleyin:**
- `DB_PASSWORD` PostgreSQL şifrenizi girin

- `JWT_SECRET` ve `JWT_REFRESH_SECRET` değiştirin

- Email ayarlarını yapın (Gmail SMTP)
5. **Veritabanını senkronize edin:**

```bash
npm run dev
```

İlk çalıştırmada otomatik olarak tablolar oluşturulacaktır.

## 🏃 Çalıştırma

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Testleri Çalıştırma

```bash
npm test
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint                             | Açıklama               | Auth |
| ------ | ------------------------------------ | ---------------------- | ---- |
| POST   | `/api/v1/auth/register`              | Kullanıcı kaydı        | ❌    |
| GET    | `/api/v1/auth/verify-email/:token`   | Email doğrulama        | ❌    |
| POST   | `/api/v1/auth/login`                 | Giriş yap              | ❌    |
| POST   | `/api/v1/auth/refresh`               | Token yenile           | ❌    |
| POST   | `/api/v1/auth/logout`                | Çıkış yap              | ✅    |
| POST   | `/api/v1/auth/forgot-password`       | Şifre sıfırlama isteği | ❌    |
| POST   | `/api/v1/auth/reset-password/:token` | Şifreyi sıfırla        | ❌    |

### User Management

| Method | Endpoint                           | Açıklama                 | Auth    |
| ------ | ---------------------------------- | ------------------------ | ------- |
| GET    | `/api/v1/users/me`                 | Profil bilgilerim        | ✅       |
| PUT    | `/api/v1/users/me`                 | Profil güncelle          | ✅       |
| POST   | `/api/v1/users/me/profile-picture` | Profil fotoğrafı yükle   | ✅       |
| GET    | `/api/v1/users`                    | Tüm kullanıcılar (Admin) | ✅ Admin |

## 🔐 Authentication

API JWT (JSON Web Token) kullanır. Protected endpoint'lere erişmek için:

```
Authorization: Bearer {your_access_token}
```

## 📦 Proje Yapısı

```
backend/
├── src/
│   ├── config/          # Veritabanı ve konfigürasyon
│   ├── controllers/     # Route controller'ları
│   ├── middleware/      # Auth, error handling, upload
│   ├── models/          # Sequelize modelleri
│   ├── routes/          # API route tanımları
│   ├── services/        # Business logic
│   ├── utils/           # Yardımcı fonksiyonlar
│   └── app.js           # Express app
├── tests/               # Test dosyaları
├── uploads/             # Yüklenen dosyalar
├── .env.example         # Örnek environment variables
└── package.json
```

## 🧪 Test

```bash
# Tüm testleri çalıştır
npm test

# Test coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## 🐛 Hata Ayıklama

### Veritabanı bağlantı hatası

- PostgreSQL servisinin çalıştığından emin olun
- `.env` dosyasındaki DB bilgilerini kontrol edin

### Email gönderilmiyor

- Gmail hesabı için "Uygulama Şifresi" oluşturun
- 2FA aktif olmalı
- `.env` dosyasında `EMAIL_USER` ve `EMAIL_PASSWORD` doğru olmalı

## 📝 Environment Variables

Detaylı açıklama için `.env.example` dosyasına bakın.

## 👥 Ekip

- [Ahmet Kaya]

## 📄 Lisans

MIT



**Admin Giriş Bilgileri:**

- **Email:** mehmet.sevri@university.edu.tr

- **Şifre:** Admin123
