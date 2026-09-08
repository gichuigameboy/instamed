import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Calendar, Shield, Clock, Users, ArrowRight, CheckCircle2, Star, Activity, Stethoscope } from 'lucide-react';
import logo from '@/assets/logo.jpeg';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';

const features = [
  {
    icon: Video,
    title: 'HD Video Consultations',
    description: 'Connect with world-class specialists face-to-face from the comfort of your home.'
  }, 
  {
    icon: Calendar,
    title: 'Instant Scheduling',
    description: 'Book and manage appointments seamlessly with our intelligent scheduling system.'
  }, 
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your health data is encrypted end-to-end and protected at all times.'
  }, 
  {
    icon: Activity,
    title: 'AI Symptom Checker',
    description: 'Get immediate insights and triage recommendations powered by advanced AI.'
  }
];

const stats = [
  { value: '10K+', label: 'Active Patients' }, 
  { value: '500+', label: 'Specialists' }, 
  { value: '98%', label: 'Satisfaction Rate' }, 
  { value: '24/7', label: 'Availability' }
];

export default function Landing() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 mesh-bg-dark opacity-40 dark:opacity-100 z-0"></div>

      {/* Floating Header */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="container max-w-6xl mx-auto">
          <nav className="glass-nav rounded-full px-6 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="InstaMed Logo" className="h-10 w-10 object-cover rounded-full border border-border" />
              <span className="text-xl font-bold text-foreground">InstaMed</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Platform
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Testimonials
              </a>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <Button className="rounded-full hover-lift" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="rounded-full hidden sm:inline-flex" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button className="rounded-full hover-lift" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 z-10 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/20 text-primary text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The Future of Healthcare
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight">
                Healthcare, <br />
                <span className="text-gradient">Redefined.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Connect with world-class medical specialists, manage your health records, and get AI-powered insights—instantly and securely.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-base rounded-full hover-lift" asChild>
                  <Link to="/auth">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full glass-nav hover-lift" asChild>
                  <Link to="/doctors">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Find a Specialist
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }} 
              animate={{ opacity: 1, scale: 1, rotate: 0 }} 
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} 
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square rounded-[3rem] overflow-hidden glass-panel flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-accent/5">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                
                <Card className="relative z-10 shadow-2xl border-white/20 bg-background/80 backdrop-blur-xl w-full max-w-md rounded-2xl overflow-hidden hover-lift">
                  <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
                          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                            <Users className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-success border-2 border-background rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-foreground">Dr. Sarah Johnson</p>
                        <p className="text-sm text-primary font-medium">Chief Cardiologist</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/50 border border-border/50">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span className="font-medium">Available for instant video consult</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/50 border border-border/50">
                        <Star className="w-5 h-5 text-warning fill-warning" />
                        <span className="font-medium">4.9 ★ rating (500+ verified reviews)</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-6 rounded-xl h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                      Connect Now
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Floating Elements */}
                <div className="absolute -right-4 top-20 bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Heart Rate</p>
                    <p className="font-bold">72 BPM</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-12 border-y border-border/50 glass-nav">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.1 }} 
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">{stat.value}</p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 md:py-32">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              A Complete Health Ecosystem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your wellbeing in one beautifully designed, secure platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full glass-panel hover-lift border-white/10 group cursor-pointer bg-background/50">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary to-accent p-12 md:p-20 text-center shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <h2 className="relative z-10 text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Experience the Future of Care
            </h2>
            <p className="relative z-10 text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join InstaMed today and take absolute control of your health journey.
            </p>
            <Button size="lg" variant="secondary" className="relative z-10 h-14 px-10 text-lg rounded-full shadow-xl hover:scale-105 transition-transform" asChild>
              <Link to="/auth">
                Create Free Account
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 glass-nav py-12 mt-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="InstaMed Logo" className="h-8 w-8 object-cover rounded-full grayscale opacity-70" />
              <span className="text-xl font-bold text-muted-foreground">InstaMed</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              © 2026 Patrick Gichui. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}