# Auto_Parts_Dynamic_system
### AA Auto Parts — Genuine Auto Spares E-Commerce & Dynamic Inventory System

A full-stack, enterprise-grade Automobile Spare Parts E-Commerce and Inventory Management Platform built with React, TypeScript, Node.js, Express, MongoDB Atlas, and Tailwind CSS.

---

## 🚀 Key Highlights & Features

### 🛒 Customer Store Front
- **Dynamic Vehicle Fitment Engine (My Garage)**: Cascading selection of Make, Model, and Year for 100% fitment accuracy.
- **Interactive Parts Catalog**: Filter by category, brand, vehicle compatibility, condition (New, Used, Refurbished), and price ranges.
- **Real-Time Search**: Search by Part Name, Brand, OEM number, or SKU.
- **Cart & Checkout**: Multi-step checkout with instant address management and order placement.
- **Order Tracking & Invoices**: Real-time status progression (`pending` → `confirmed` → `processing` → `shipped` → `delivered`) with printable invoices.
- **Email Verification & Authentication**: Robust customer registration with 6-digit OTP verification and JWT security.

### 🛡️ Administrator Operations Hub (`/admin`)
- **Exclusive Isolated Admin Portal**: Dedicated admin authentication strictly separated from customer login.
- **Environment-Synced Master Access**: Dynamic live synchronization with server environment (`.env`) credentials.
- **Executive Overview Dashboard**: Total sales velocity, pending order counters, active customer metrics, and revenue charts.
- **Real-Time Inventory Management**: Instant restock actions, stock levels monitoring, and critical low-stock alerts.
- **Full Vehicle Fitment Mapping**: Create and manage Make, Model, Category, and universal spare parts compatibility.
- **Audit Logs**: Inventory change logs, timestamped restock operations, and user management.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT, Bcrypt, Nodemailer
- **Database**: MongoDB Atlas
- **Storage**: Multi-source image handling (Local high-res photography + Cloudinary CDN ready)

---

## ⚙️ Quick Start Guide

### 1. Clone the repository
```bash
git clone https://github.com/affan-ahmed123/Auto_Parts_Dynamic_system.git
cd Auto_Parts_Dynamic_system
```

### 2. Install Dependencies
```bash
# Root & workspaces
npm install
npm --prefix client install
npm --prefix server install
```

### 3. Environment Configuration
Create a `.env` file in the `server` folder following `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Admin Master Credentials
ADMIN_EMAIL=admin123@gmail.com
ADMIN_PASSWORD=admin1243@
```

### 4. Seed Initial Catalog (Optional)
```bash
npm --prefix server run seed
```

### 5. Run the Application
```bash
# Run both client and server concurrently
npm run dev
```
- Storefront: `http://localhost:5173`
- Admin Operations Hub: `http://localhost:5173/admin`
- Backend API: `http://localhost:5000`

---

## 👨‍💻 Proposed & Developed By
**Affan Ahmed**  
- Email: [affan.codes01@gmail.com](mailto:affan.codes01@gmail.com)  
- Brand: **AA Auto Parts &bull; Genuine Auto Spares**
