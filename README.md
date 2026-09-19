# 📊 StorePulse — eCommerce Analytics SaaS

**StorePulse** is a full-stack SaaS analytics platform that helps online store owners monitor product performance, revenue, orders, inventory, and customer activity through a modern analytics dashboard.

Built with a production-ready architecture using modern web technologies, StorePulse focuses on turning raw eCommerce data into actionable performance insights.

---

## 🚀 Features

### 🔐 Authentication

- Secure email & password authentication
- User registration & login
- Protected dashboard routes
- JWT-based sessions
- Store-based data isolation
- Role support foundation

---

### 📈 Analytics Dashboard

The main dashboard provides a high-level overview of store performance.

- Real-time KPIs from PostgreSQL
- Revenue tracking
- Orders overview
- Unique customers
- Average order value
- Sales performance charts
- Top-selling products
- Recent orders
- Database-driven analytics

---

### 📊 Advanced Analytics

StorePulse includes a dedicated analytics area for deeper business insights.

- Revenue forecasting
- Forecast visualization
- Historical performance analysis
- Trend analysis foundation
- Model comparison foundation
- Dedicated analytics dashboard

---

### 📦 Product Analytics

Each product has its own analytics page with detailed performance information.

- Product revenue
- Units sold
- Order count
- Average order value
- Performance vs previous 30 days
- 30-day sales performance chart
- Revenue / Units Sold toggle
- Sales summary
- Average daily revenue
- Average units sold per day
- Best sales day
- Worst sales day
- Days with sales
- Store revenue contribution
- Current inventory
- Stock status

Product analytics are calculated from real PostgreSQL data rather than static mock data.

---

### 🔎 Product Search

The Products section includes client-side search functionality.

- Search by product name
- Search by SKU
- Real database products
- Product detail navigation
- Stock status indicators

---

### 🗄️ Database

- PostgreSQL relational database
- Prisma ORM
- Typed database access
- Relational product / order / order item data
- Seeded demo data
- Store-based data relationships
- Production-ready schema foundation

---

## 🧱 Architecture

- Next.js App Router
- React Server Components
- Client Components where interactivity is required
- Server-side database queries
- API Routes / Route Handlers
- Auth.js (NextAuth v5)
- Prisma ORM
- Modular analytics services
- Scalable SaaS architecture

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Recharts**
- **Lucide Icons**

### Backend

- **Next.js Server Components**
- **Next.js Server Actions & Route Handlers**
- **Auth.js (NextAuth v5)**
- **Prisma ORM**
- **PostgreSQL**

### Development Tools

- Prisma Studio
- pgAdmin
- tsx
- TypeScript

---

## 📂 Project Structure

```text
src/
├─ app/
│  ├─ api/
│  ├─ dashboard/
│  │  ├─ analytics/
│  │  ├─ products/
│  │  │  └─ [id]/
│  │  ├─ orders/
│  │  ├─ customers/
│  │  ├─ billing/
│  │  └─ settings/
│  ├─ login/
│  ├─ register/
│  └─ layout.tsx
│
├─ components/
│  ├─ dashboard/
│  └─ providers/
│
├─ lib/
│  ├─ analytics/
│  │  ├─ dashboard.ts
│  │  ├─ overview.ts
│  │  └─ product.ts
│  └─ db.ts
│
└─ types/

prisma/
├─ schema.prisma
└─ seed.ts
