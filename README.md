# LEGALEX — Law Firm Website & Client/Case Management Portal

A premium, production-quality law firm website and comprehensive case management SaaS portal for **LEGALEX Chambers & Advocates**, established in 2009 by **Adv. Amit S. Rathi** (Sanad No. 5803-2008) in Maharashtra.

---

## 🏛️ Firm Overview
- **Chambers**: LEGALEX Chambers & Advocates
- **Established & Registered**: 2009
- **Founder, Director & CGO**: Adv. Amit S. Rathi (Sanad No. 5803-2008, Bar Council of Maharashtra & Goa)
- **Chambers Location**: Suite 402–405, Prestige Commercial Arcade, Near District & Sessions Court, Shivaji Nagar, Pune, Maharashtra 411005
- **Direct Phone**: +91 99220 79879
- **Practice Areas**: Civil & Family, Revenue (MLRC 1966), Consumer Protection, Criminal Defence, MACT Claims
- **Scale Stats**: 1,291 Active Cases, 480 Completed Cases, 16+ Years Experience, 8 Legal Specialists

---

## ⚡ Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript + React 19
- **Styling**: Tailwind CSS v4 + Custom Law Firm Design System (Deep Navy `#0B1F3A`, Warm Gold `#C9A24B`, Cream `#F8F6F1`)
- **Database & ORM**: Prisma + SQLite (zero-config, seamlessly migratable to PostgreSQL)
- **Authentication**: NextAuth / Auth.js (Credentials + Email OTP login with RBAC and middleware route protection)
- **Storage**: Pluggable storage abstraction (Local file storage in `/public/uploads/` ready for AWS S3)
- **Data Visualizations**: Recharts
- **Icons**: Lucide Icons
- **Document Verification**: Cryptographic SHA256 digital seals & QR code generation

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Auto-Seed
```bash
npx prisma db push
npx tsx prisma/seed.ts
npx tsx prisma/seed_additional.ts
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be live at: **`http://localhost:3000`**

---

## 🔐 Demo Login Credentials (All 4 Roles)

You can use the **1-Click Quick Role Switcher** on the `/login` page or enter credentials manually:

| Role | Name & Title | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Client Admin** *(Recommended)* | Adv. Amit S. Rathi (Managing Partner) | `admin@legalex.in` | `Admin@1234` | Full firm oversight, case management, staff, invoices, verified documents |
| **Team Legalex** | Adv. Sneha Deshmukh (Sr. Associate) | `team@legalex.in` | `Team@1234` | Assigned cases only, hearing updates, PDF uploads, case notes |
| **Client User** | Rajesh Sharma (Rameshwar Industries) | `client@legalex.in` | `Client@1234` | Personal case tracking, court listings, view invoices, download verified PDFs |
| **Super Admin** | System Administrator | `superadmin@legalex.in` | `Admin@1234` | Full platform control, audit logs, security settings |

*Note: For Email OTP login, enter the user's email, click "Send OTP", and enter demo code `123456` or the generated code logged to the server terminal.*

---

## 📁 Key Routes

### Public Website
- `/` — Homepage (Hero, Stats, Practice Areas, Founder, Landmark Results, Timeline, Testimonials, FAQ)
- `/about` — Firm History, Values, Founder Profile (Sanad 5803-2008), 8-Member Team Roster
- `/practice-areas` — Overview of 5 litigation domains
  - `/practice-areas/civil-and-family` — Civil, Title, Partition & Matrimonial
  - `/practice-areas/revenue` — Maharashtra Land Revenue Code & 7/12 Disputes
  - `/practice-areas/consumer` — Consumer Protection Commissions
  - `/practice-areas/criminal` — Trial Advocacy, Bail & High Court Quashing
  - `/practice-areas/mact` — Motor Accident Claims Tribunal
- `/case-results` — Landmark judicial outcomes and decrees
- `/insights` & `/insights/[slug]` — 6 in-depth legal commentary articles
- `/contact` — Contact form (DB-backed), direct phone, WhatsApp link, Google Map
- `/book-consultation` — Multi-step consultation booking wizard with DB-backed live slots
- `/verify-document` — Public document verification search engine
- `/verify-document/[id]` — Permanent verification certificate with QR code and seal
- `/disclaimer` — Bar Council of India Rule 36 mandatory disclaimer

### SaaS Client / Case Management Portal
- `/portal/dashboard` — Role-adaptive analytics, active vs completed breakdown, hearings, pending billing
- `/portal/cases` — Filterable case grid, search, CSV export, case registration wizard
- `/portal/cases/[id]` — Core 4-Tab Case Hub:
  - Tab 1: **Case Details** (Court, stage, judge, timeline, internal strategy notes)
  - Tab 2: **PDF Documents** (Upload, categorization, QR seal generation, preview, download)
  - Tab 3: **Billing** (GST tax invoices, line items, payment recording modal, printable receipt)
  - Tab 4: **Client Details** (KYC, contact, masked PAN/Aadhaar, linked case files)
- `/portal/hearings` — Hearing schedule, court rooms, reminder dispatcher (WhatsApp/SMS logged to console)
- `/portal/reminders` — Dedicated Reminder Management (8 categories: Hearing, Filing Deadline, Case Follow-up, Client Follow-up, Document Submission, Payment, Task, Personal; priority, snooze, and completion tracking)
- `/portal/tasks` — Legal Work & Task Operations (Substantive pleadings drafting, court filings, and research assignments separated from alerts)
- `/portal/expenses` — Chambers Financial Expenses (Court fees, filing charges, advocate transit, paperbook printing, and office overheads)
- `/portal/conflict-check` — Conflict of Interest Check Tool (Instant adverse party screening across clients and cases with BCI Rule clearance status)
- `/portal/documents` — Master document center & QR seal validator
- `/portal/invoices` — Firm-wide invoicing and payment ledger
- `/portal/clients` — Client CRM & KYC records
- `/portal/team` — 8-member team roster and active caseloads
- `/portal/appointments` — Consultation slot scheduler and public contact inquiries
- `/portal/audit-logs` — Security audit trail
- `/portal/settings` — Profile and localization readiness (English, Marathi, Hindi)

---

## ⚙️ How to Replace Demo Data with Legalex's Real Details

All firm information is centralized for 1-step customization:

1. **Firm Details, Team, Phone, and Practice Areas**:
   - Edit file: **`src/config/site.ts`**
   - Change `name`, `founder`, `contact` (phone, email, Pune address), `stats`, `teamMembers`, and `practiceAreas`.
   - Any modification in `site.ts` immediately updates the public website and portal headers.

2. **Seeded Cases, Invoices, and Clients**:
   - Edit file: **`prisma/seed.ts`**
   - Re-run `npx tsx prisma/seed.ts` to refresh the database with real case files and clients.

3. **Switch from SQLite to PostgreSQL (Production)**:
   - In `prisma/schema.prisma`, change:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - Provide your PostgreSQL connection string in `.env` and run `npx prisma db push`.
