# FreshGuard — Web Admin Panel

Briefə uyğun olaraq **yalnız Super Admin web paneli**: reyon yetkililərinin idarəsi, mağaza/şöbə strukturu, ümumi görünüş (mock əməliyyat göstəriciləri). Backend **Java Spring Boot 3** (JWT + bcrypt), frontend **React (Vite + TypeScript + Tailwind)**.

## Tələblər

- **Backend:** JDK 17+, Maven 3.9+
- **Frontend:** Node.js 18+

## Demo giriş (Super Admin)

| Field   | Dəyər              |
|--------|---------------------|
| User ID | `SA-ADMIN`         |
| Şifrə   | `SuperAdmin!2026` |

Demo **regional manager** (Android üçün eyni API ilə giriş testi): `RM-2026-00001` / `DemoRm!2026` — bu hesab paneldə **giriş etmir** (yalnız `SUPER_ADMIN` icazəsi), amma backend-də mövcuddur.

## İşə salma

### 1) Backend

```powershell
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080`

Əsas endpointlər:

- `POST /api/auth/login` — JWT (24 saat mock konfiq)
- `GET /api/admin/overview/summary` — ümumi görünüş
- `GET|POST /api/admin/users` — reyon yetkililəri (+ `PUT`, `PATCH .../deactivate`)
- `GET|POST /api/admin/stores` — mağazalar (+ şöbə `POST .../stores/{id}/departments`, `PUT .../stores/departments/{deptId}`)

İstəhsal üçün `application.yml` faylında `freshguard.jwt.secret` dəyərini uzun təsadüfi açarla əvəz edin.

### 2) Frontend

```powershell
cd frontend
npm install
npm run dev
```

UI: `http://localhost:5173` — Vite proxy `/api` → `8080`.

İstehsal build:

```powershell
cd frontend
npm run build
npm run preview
```

Statik faylları istənilən CDN/nginx üzərində saxlaya bilərsiniz; API üçün CORS-da frontend origin əlavə edin.

## Layihə strukturu

```
backend/          Spring Boot (mock in-memory data)
frontend/         React admin SPA
```

Android tətbiqi və POS bu repoda **daxil deyil** — eyni backend kontraktına uyğun genişləndirmək olar.
