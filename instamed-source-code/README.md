# InstaMed - Healthcare Appointment Platform

A modern healthcare appointment booking platform built with React, TypeScript, Vite, and Supabase.

## 🏥 About InstaMed

InstaMed is a comprehensive healthcare management platform that connects patients with healthcare providers, making it easy to find doctors, book appointments, and manage health records.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password authentication with Supabase
- 👨‍⚕️ **Doctor Directory** - Browse and search for healthcare professionals
- 📅 **Appointment Booking** - Easy-to-use appointment scheduling system
- 📊 **Patient Dashboard** - View appointments, medical history, and health records
- 🏥 **Doctor Profiles** - Detailed information about healthcare providers
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔔 **Email Notifications** - Automated appointment confirmations and reminders

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.8** - Type-safe JavaScript
- **Vite 5.4** - Fast build tool and dev server
- **React Router 6.30** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication & authorization
  - Real-time subscriptions
  - Edge functions
  - Row-level security

### State Management
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- A Supabase account ([sign up free](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd instamed-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   VITE_SUPABASE_PROJECT_ID=your-project-id
   ```

   **To get your Supabase credentials:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create a new project (or select existing one)
   - Navigate to Settings → API
   - Copy the Project URL and anon/public key

4. **Set up Supabase database**
   
   Run the migrations in the `supabase/migrations` folder in your Supabase project:
   - Go to SQL Editor in your Supabase dashboard
   - Run each migration file in order

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:8080
   ```

## 📁 Project Structure

```
instamed-main/
├── public/              # Static assets
│   ├── assets/         # Images, icons
│   ├── _redirects      # Netlify redirects for SPA
│   └── favicon.ico
├── src/
│   ├── components/     # Reusable React components
│   │   └── ui/        # shadcn/ui components
│   ├── hooks/         # Custom React hooks
│   ├── integrations/  # External service integrations
│   │   └── supabase/  # Supabase client and types
│   ├── lib/           # Utility functions and configs
│   │   └── auth.tsx   # Authentication context
│   ├── pages/         # Page components (routes)
│   │   ├── Landing.tsx        # Homepage
│   │   ├── Auth.tsx           # Login/Signup
│   │   ├── Dashboard.tsx      # User dashboard
│   │   ├── Doctors.tsx        # Doctor listing
│   │   ├── Appointments.tsx   # Appointment management
│   │   └── VerifyEmail.tsx    # Email verification
│   ├── App.tsx        # Main app component with routing
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles
├── supabase/          # Supabase configuration
│   ├── functions/     # Edge functions
│   └── migrations/    # Database migrations
├── .env               # Environment variables (not committed)
├── netlify.toml       # Netlify configuration
├── package.json       # Dependencies and scripts
├── vite.config.ts     # Vite configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## 💻 Available Scripts

```bash
# Development
npm run dev          # Start dev server at http://localhost:8080

# Building
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Deployment to Netlify

### Option 1: Connect Git Repository (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Log in to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"

3. **Connect your repository**
   - Choose your Git provider
   - Select your repository
   - Authorize Netlify

4. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These should auto-populate from `netlify.toml`

5. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
     VITE_SUPABASE_PROJECT_ID=your-project-id
     ```

6. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Every push to your main branch will trigger a new deployment

### Option 2: Manual Deploy

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

### Custom Domain

To add a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to update your DNS settings

## 🔧 Supabase Configuration

### Database Tables

The application uses the following main tables:
- `profiles` - User profile information
- `doctors` - Healthcare provider information
- `appointments` - Appointment bookings
- `user_roles` - User role assignments
- `specializations` - Medical specializations

### Authentication Setup

1. **Email Templates**
   - Go to Authentication → Email Templates
   - Customize confirmation and reset password emails
   - Update sender name and email

2. **URL Configuration**
   - Go to Authentication → URL Configuration
   - Set Site URL to your Netlify domain
   - Add Redirect URLs for your domain

3. **Policies**
   - Database tables use Row Level Security (RLS)
   - Policies are defined in migration files
   - Users can only access their own data

## 🔒 Security

- Environment variables are never committed to git
- All API keys should be set in Netlify's environment variables
- Supabase Row Level Security (RLS) protects database access
- HTTPS is enforced on Netlify
- Security headers are configured in `netlify.toml`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Netlify](https://netlify.com) - Hosting platform
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Tailwind CSS](https://tailwindcss.com) - Styling framework

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [Supabase documentation](https://supabase.com/docs)
- Check the [Netlify documentation](https://docs.netlify.com)

---

**Built with ❤️ using React, TypeScript, Supabase, and Netlify**
