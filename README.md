# 📊 StorePulse — eCommerce Analytics SaaS

**StorePulse** is a full-stack SaaS analytics platform that helps online store owners monitor performance, revenue, and customer activity through a modern dashboard.

Built with a production-ready architecture using the latest web technologies.

---

## 🚀 Live Features

### 🔐 Authentication

* Secure email & password authentication
* User registration & login
* Protected dashboard routes
* JWT sessions
* Role support

### 📈 Analytics Dashboard

* Real-time KPIs from database
* Revenue tracking
* Orders overview
* Unique customers count
* Average order value
* Sales chart (weekly performance)
* Top-selling products
* Recent orders table

### 🗄️ Database

* PostgreSQL relational database
* Prisma ORM
* Typed database access
* Seeded demo data
* Production-ready schema

### 🧱 Architecture

* App Router (Next.js)
* Server Components
* API Routes
* Auth.js (NextAuth v5)
* Clean folder structure
* Scalable SaaS foundation

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Recharts**
* **Lucide Icons**

### Backend

* **Next.js Server Actions & Route Handlers**
* **Auth.js (NextAuth v5)**
* **Prisma ORM**
* **PostgreSQL**

### Dev Tools

* Prisma Studio
* pgAdmin
* tsx (TypeScript runner)

---

## 📂 Project Structure

```
src/
 ├─ app/
 │   ├─ api/
 │   ├─ dashboard/
 │   ├─ login/
 │   ├─ register/
 │   └─ layout.tsx
 │
 ├─ components/
 │   ├─ dashboard/
 │   └─ providers/
 │
 ├─ lib/
 │   ├─ db.ts
 │   └─ analytics.ts
 │
 └─ types/
 
prisma/
 ├─ schema.prisma
 └─ seed.ts
```

---

## ⚙️ Getting Started

### 1️⃣ Clone repository

```bash
git clone https://github.com/yourusername/storepulse.git
cd storepulse
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecommerce_analytics"
AUTH_SECRET="your-secret"
```

---

### 4️⃣ Setup database

```bash
npx prisma migrate dev
```

---

### 5️⃣ Seed demo data

```bash
npx prisma db seed
```

Demo credentials:

```
Email: mario@example.com
Password: 123456
```

---

### 6️⃣ Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧪 Demo Data

The seed script creates:

* 👤 1 User
* 🏬 1 Store
* 📦 4 Products
* 🧾 5 Orders
* 🧩 Order Items with product relations

---

## 📸 Screenshots (optional)

*Add dashboard screenshots here*

---

## 🧠 Roadmap

* [x] Authentication system
* [x] Protected dashboard
* [x] Real analytics from database
* [x] KPI metrics engine
* [ ] Date range filters
* [ ] Multi-store support
* [ ] Stripe subscriptions
* [ ] CSV export
* [ ] Webhooks & integrations

---

## 🎯 Use Cases

* eCommerce performance tracking
* SaaS dashboard template
* Analytics product foundation
* Portfolio full-stack project

---

## 🔒 Security

* Password hashing with bcrypt
* JWT sessions
* Protected routes
* Server-side data fetching

---

## 👨‍💻 Author

Built by **Marius**
Full-Stack Web Developer

---

## 📄 License

MIT License — feel free to use and modify.
