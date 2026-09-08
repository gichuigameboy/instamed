import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Calendar, Settings, PhoneCall, MessageSquare } from 'lucide-react';
import logo from '@/assets/logo.jpeg';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth';

// Removed hardcoded navLinks here, moved inside the component to use isDoctor

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, isDoctor, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    ...(!isDoctor ? [{ href: '/doctors', label: 'Find Doctors' }] : []),
    { href: '/appointments', label: 'Appointments' },
    { href: '/messages', label: 'Messages' },
    ...(!isDoctor ? [
      { href: '/ai-symptom-checker', label: 'AI Checker' },
      { href: '/clinics', label: 'Clinics' }
    ] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-4 z-50 w-full px-4 mb-8">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between glass-nav rounded-full px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="InstaMed Logo" className="h-10 w-10 object-contain rounded-full" />
          <span className="text-xl font-bold text-foreground">InstaMed</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Button variant="destructive" size="sm" className="hidden sm:flex rounded-full animate-pulse" asChild>
            <a href="tel:922">
              <PhoneCall className="w-4 h-4 mr-2" />
              SOS (922)
            </a>
          </Button>
          <Button variant="destructive" size="icon" className="sm:hidden rounded-full animate-pulse" asChild>
            <a href="tel:922">
              <PhoneCall className="w-4 h-4" />
            </a>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile?.first_name?.[0]}
                      {profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {profile?.first_name?.[0]}
                      {profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/appointments" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Appointments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/messages" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border"
        >
          <nav className="container py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
