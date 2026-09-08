<div align="center">

# 📚 Teacher'sDesk

**A modern classroom management web application for teachers**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongodb.com)
[![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js_v5-purple)](https://authjs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

[Live Demo](#) · [Report a Bug](https://github.com/Nimisha5747/teachersDesk/issues) · [Request a Feature](https://github.com/Nimisha5747/teachersDesk/issues)

</div>

---

## ✨ Overview

**Teacher'sDesk** is a full-stack classroom management platform designed for teachers to manage everything about their students in one place — homework, test records, attendance, remarks, fees, and downloadable sheet templates.

> Built with **Next.js 14 App Router**, **MongoDB**, and **NextAuth.js**, with a clean white design system using vanilla CSS.

---

## 🖼️ Screenshots

| Landing Dashboard | Student Profile |
|---|---|
| Hero banner with student account grid | Contextual sidebar with per-student panels |

---

## 🚀 Features

### 👩‍🏫 Teacher Dashboard
- **Hero banner** on landing with total student count, HW sheets created, and test sheets created stats
- **Student grid** — searchable cards for all registered students
- **Add students** via a polished modal form

### 👤 Student Profiles
Click any student card to open their dedicated workspace:

| Panel | Description |
|---|---|
| 📖 **Homework** | Create & track homework assignments with due dates and status |
| 📋 **Test Sheets** | Manage test records with grading and status tracking |
| 📅 **Attendance** | Mark daily attendance (Present / Absent / Late / Excused) with % stats |
| 💬 **Remarks** | Add categorised teacher notes (Academic, Behaviour, Health, General) |
| 💳 **Fee Status** | Track fee payments, amounts, and due dates |
| ⚙️ **Student Details** | View, edit, or delete a student's full profile |

### 📄 Downloadable Templates
Each Homework and Test Sheet panel includes a **Template Downloader** — choose a template type and download as:
- **PDF** — opens a print dialog (use "Save as PDF")
- **Word Doc (.doc)** — A4 sized, opens in Microsoft Word or LibreOffice

**HW Templates:** Lined Worksheet · Fill in the Blanks · Multiple Choice · Short Answer · Match the Following

**Test Templates:** Objective MCQ · Short Answer · Long Answer · Mixed Format · True / False

### 🔐 Authentication
- Email / password sign-up and sign-in
- Google OAuth one-click sign-in
- Password strength indicator on registration
- JWT session strategy with route protection via Next.js middleware

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS with CSS custom properties |
| **Database** | MongoDB via Mongoose |
| **Auth** | NextAuth.js v5 (Credentials + Google OAuth) |
| **Icons** | Lucide React |
| **Fonts** | Playfair Display + Inter (Google Fonts) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth route handler
│   │   ├── register/             # Teacher registration endpoint
│   │   ├── students/             # Student CRUD
│   │   ├── homework/             # Homework CRUD
│   │   ├── attendance/           # Attendance CRUD
│   │   ├── remarks/              # Remarks CRUD
│   │   └── fees/                 # Fee records CRUD
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── globals.css               # Full design system (CSS variables, components)
│   ├── layout.tsx                # Root layout with SessionProvider
│   └── page.tsx                  # Protected dashboard page
├── components/
│   ├── panels/
│   │   ├── HomeworkPanel.tsx
│   │   ├── TestSheetPanel.tsx
│   │   ├── AttendancePanel.tsx
│   │   ├── RemarksPanel.tsx
│   │   ├── FeePanel.tsx
│   │   ├── StudentDetailsPanel.tsx
│   │   └── TemplateDownloader.tsx
│   ├── DashboardClient.tsx       # Main dashboard with routing logic
│   ├── Navbar.tsx
│   ├── Sidebar.tsx               # Dual-mode sidebar (teacher / student context)
│   ├── HeroBanner.tsx
│   ├── StudentCard.tsx
│   └── AddStudentModal.tsx
├── lib/
│   ├── mongodb.ts                # MongoDB connection utility
│   └── models/                   # Mongoose schemas
│       ├── User.ts
│       ├── Student.ts
│       ├── Homework.ts
│       ├── Attendance.ts
│       ├── Remark.ts
│       └── Fee.ts
├── auth.ts                       # NextAuth configuration
└── types/
    └── next-auth.d.ts            # Session type augmentation
middleware.ts                     # Route protection
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** 18 or later
- **MongoDB** — local instance or [MongoDB Atlas](https://cloud.mongodb.com) (free tier)
- **Google OAuth credentials** (optional, for Google sign-in)

### 1. Clone the repository

```bash
git clone https://github.com/Nimisha5747/teachersDesk.git
cd teachersDesk
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/teachersdesk

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-here

# Your deployment URL (use http://localhost:3000 for local dev)
NEXTAUTH_URL=http://localhost:3000

# Google OAuth — create at https://console.cloud.google.com
# Set authorized redirect URI to: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> **Note:** Google OAuth credentials are only needed if you want Google sign-in. Email/password auth works without them.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

### 5. Create your teacher account

Click **"Create one free"** on the login page to register with email/password or Google.

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `NEXTAUTH_URL` | ✅ | Base URL of the app |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth app ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth app secret |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub (already done)
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the environment variables in the Vercel dashboard
4. Deploy — Vercel handles the rest

### Self-hosted

```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ for teachers everywhere

</div>
