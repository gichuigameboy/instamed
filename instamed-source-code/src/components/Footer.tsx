import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary/5 pt-16 pb-8 border-t border-border mt-auto">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">InstaMed</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Accessible healthcare in Kenya. Consult with top doctors, check your symptoms with AI, and manage your health seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/doctors" className="text-muted-foreground hover:text-primary transition-colors">Find Doctors</Link></li>
              <li><Link to="/clinics" className="text-muted-foreground hover:text-primary transition-colors">Clinic Finder</Link></li>
              <li><Link to="/ai-symptom-checker" className="text-muted-foreground hover:text-primary transition-colors">AI Symptom Checker</Link></li>
              <li><Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 space-y-4">
            <h4 className="font-semibold text-foreground">Legal & Privacy</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/data-permissions" className="text-muted-foreground hover:text-primary transition-colors">Data Permissions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:support@instamed.co.ke" className="hover:text-primary transition-colors">support@instamed.co.ke</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} InstaMed. All rights reserved.</p>
          <p>
            Developed for accessible healthcare in Kenya.
          </p>
        </div>
      </div>
    </footer>
  );
}