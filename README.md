# HospitalStore.com — Full-Stack Medical Equipment E-Commerce Platform

A production-grade, full-stack clone and modern redesign of **HospitalStore.com** built with **React (Tailwind CSS, Lucide Icons, Canvas Confetti)** and a high-performance **Python FastAPI + SQLite** backend.

---

## 🌟 Key Upgrades & UI/UX Highlights (Superior to Original)

1. **Modern Medical Tech Aesthetics:**
   - Surgical clean aesthetic featuring Trust Blue (`#0284c7`), Emerald Green accents (`#10b981`), and dark slate tones.
   - Micro-interactions, smooth hover elevations, product zoom, interactive badges (e.g. `23% OFF`, `Trending`, `In Stock • Ships in 24h`).
   - Sticky header with real-time live search autocomplete, department mega-ribbon, and cart count badges.

2. **B2B Hospital Procurement & Quotation Engine (RFQ):**
   - High-end hospital machinery (e.g. ICU ventilators, Doppler ultrasound scanners, OT lights) features an instant **"Request Hospital RFQ"** dialog.
   - Hospital administrators can specify unit quantities, timeline, and custom clinical accessories.
   - Direct integration with WhatsApp specialist chats and automatic lead logging in `/admin`.

3. **Complete Cart, Checkout & Billing System:**
   - Slide-over interactive Cart Drawer with free shipping progress bar.
   - Comprehensive multi-department checkout supporting Doctor/Purchaser details, Hospital/Clinic name, and Buyer GSTIN for 12% input tax credit.
   - Coupon system (e.g. `HOSPITAL10` saves 10%, `MEDICARE5` saves 5%).
   - Multi-method payment simulations: UPI Instant QR Code, Credit/Debit Cards (256-Bit SSL), Hospital PO / RTGS wire transfer, and Cash on Delivery.
   - Confetti celebration upon order confirmation.

4. **Live Shipment Tracking & Official Tax Invoicing:**
   - Real-time order tracking with 5-stage shipment telemetry: *Order Received → Biomedical Quality Check → Dispatched → In Transit → Delivered*.
   - Courier partner and Airway Bill (AWB) tracking number display.
   - **Full Tax Invoice Generation & Print View (`window.print()`)**: Authentic HospitalStore format with Seller GSTIN (`07AAECH7890M1Z8`), Buyer GSTIN, HSN code `9018`, CGST (6%) + SGST (6%) breakdown, and authorized signature seal.

5. **Comprehensive `/admin` Management Console:**
   - **Executive Dashboard:** Live KPIs (Total revenue, hospital orders, active devices, RFQ leads, low-stock warnings, and consignment dispatch status bars).
   - **Medical Equipment Inventory (Products CRUD):** Add, edit, delete, toggle stock status, and toggle featured items with rich technical parameters and clinical feature lists.
   - **Specialty Categories Management:** Add/edit department categories, icons, and display ordering.
   - **Orders & GST Billing:** Manage shipment states, update courier tracking numbers, inspect buyer hospital records, and print official invoices.
   - **Hospital RFQ Leads:** Review tender bids and bulk quote requests, update lead statuses, and contact doctors directly via WhatsApp.
   - **Store & Tax Settings:** Update helpline numbers, WhatsApp channels, GST rate (12%), free logistics threshold, and top announcement tickers.

---

## 🗄️ Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide React Icons, Canvas Confetti.
- **Backend:** Python 3.14, FastAPI, SQLAlchemy ORM, SQLite (`hospital_store.db`), Pydantic v2, Uvicorn.

---

## 🚀 Quick Start Guide

### 1. Backend Server (FastAPI + SQLite)
```bash
cd backend
# Seed database with authentic medical equipment & sample orders (already seeded):
python seed.py

# Start FastAPI server on port 8000:
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation (Interactive Swagger UI): `http://127.0.0.1:8000/docs`

### 2. Frontend Server (React + Vite)
```bash
cd frontend
# Install dependencies (already installed):
npm install

# Start Vite development server on port 5173:
npm run dev
```
Open Frontend in Browser: `http://localhost:5173/`

### 3. Unified Production Mode (FastAPI serves React SPA)
The backend is configured to automatically serve the built React production app (`frontend/dist`) directly from `http://127.0.0.1:8000/`.
To build:
```bash
cd frontend
npm run build
```
Then visit `http://127.0.0.1:8000/` or `http://127.0.0.1:8000/#/admin`!

---

## 🧭 Application Routes

- **Storefront Home:** `/#/`
- **Equipment Catalog with Filters:** `/#/catalog`
- **Product Details & Technical Specs:** `/#/product/:slug`
- **Shopping Cart & Checkout:** `/#/checkout`
- **Live Order Tracking:** `/#/track`
- **Admin Control Console:** `/#/admin`
  - Dashboard: `/#/admin/dashboard`
  - Products: `/#/admin/products`
  - Categories: `/#/admin/categories`
  - Orders & Billing: `/#/admin/orders`
  - Hospital RFQ Quotes: `/#/admin/quotes`
  - Settings: `/#/admin/settings`

