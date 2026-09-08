# 🏥 InstaMed — Your Health, Our Priority

> **© 2026 Patrick Gichui. All Rights Reserved.**
> Unauthorized copying, distribution, or modification of this software is strictly prohibited.

---

## 📋 Overview

**InstaMed** is a modern, full-stack healthcare web application that bridges the gap between patients and doctors. Built with a clean, responsive UI and powered by a real-time Supabase backend, InstaMed makes healthcare accessible, efficient, and intelligent.

---

## ✨ Features

### 👤 For Patients
- 🔐 **Secure Authentication** — Sign up and log in as a patient with full role-based access
- 📅 **Book Appointments** — Browse verified doctors and book consultations with ease
- 💬 **Messaging** — Send and receive real-time messages with your doctor
- 🤖 **AI Symptom Checker** — Get instant AI-powered health insights powered by Google Gemini
- 🗺️ **Clinic Finder** — Discover clinics and healthcare facilities near you
- 📂 **Health Profile** — Manage your personal health records, blood group, and medical history

### 🩺 For Doctors
- 📋 **Patient Appointments Dashboard** — View all upcoming patient appointments at a glance
- 💬 **Patient Messaging** — Communicate securely with your patients
- 👤 **Doctor Profile** — Manage your specialization, experience, and professional details
- 🟢 **Live Activity Feed** — See who is currently active on the platform in real time

### 🛡️ For Admins
- 📊 **Admin Dashboard** — Full overview of all platform activity
- 👥 **User Management** — View and manage all registered users
- 📋 **Contact Message Management** — Read and respond to contact form submissions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend & Database** | Supabase (PostgreSQL, Realtime, Auth) |
| **AI Integration** | Google Gemini API |
| **Icons** | Lucide React |
| **Routing** | React Router DOM v6 |
| **Maps** | Google Maps / Geolocation API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- A Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/gichuigameboy/instamed.git
cd instamed

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY

# Start the development server
npm run dev
```

### Build for Production

```bash
npm run build
npx vite preview --port 8081 --host
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── Navbar.tsx       # Dynamic navigation bar (role-aware)
│   ├── LiveUsersWidget.tsx  # Real-time active users feed
│   └── ChatDrawer.tsx   # In-app messaging drawer
├── pages/               # Application pages/routes
│   ├── Dashboard.tsx    # Patient & Doctor dashboard
│   ├── Appointments.tsx # Appointment management
│   ├── Doctors.tsx      # Doctor discovery & booking
│   ├── Messages.tsx     # Messaging system
│   ├── AISymptomChecker.tsx # AI health assistant
│   ├── AdminDashboard.tsx   # Admin panel
│   └── Auth.tsx         # Login & Registration
├── lib/
│   ├── auth.tsx         # Authentication context & hooks
│   └── usePresence.ts   # Supabase Realtime Presence hook
└── integrations/
    └── supabase/        # Supabase client & type definitions
```

---

## 🔐 Role-Based Access

InstaMed supports three distinct user roles, each with a tailored UI and permissions:

| Role | Access |
|---|---|
| **Patient** | Book appointments, view doctors, AI checker, clinic finder, messaging |
| **Doctor** | View patient appointments, messaging, professional profile |
| **Admin** | Full platform management, user oversight, contact messages |

---

## 🌐 Live Demo

The application is hosted and accessible at the live tunnel URL. Contact the developer for the latest deployment link.

---

## 📄 License & Copyright

```
© 2026 Patrick Gichui. All Rights Reserved.

This software and its source code are the intellectual property of Patrick Gichui.
The InstaMed name, logo, design, and codebase are protected under copyright law.

Unauthorized copying, redistribution, modification, or commercial use
of this software, in whole or in part, without the express written
permission of Patrick Gichui is strictly prohibited.

For licensing inquiries, please contact the author directly.
```

---

*Built with ❤️ by Patrick Gichui — 2026*
