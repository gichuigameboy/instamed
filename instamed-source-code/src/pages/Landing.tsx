import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Calendar, Shield, Clock, Users, ArrowRight, CheckCircle2, Star, Stethoscope } from 'lucide-react';
import logo from '@/assets/logo.jpeg';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
const features = [{
  icon: Video,
  title: 'Video Consultations',
  description: 'Connect with doctors face-to-face from the comfort of your home'
}, {
  icon: Calendar,
  title: 'Easy Scheduling',
  description: 'Book appointments in seconds with our intuitive booking system'
}, {
  icon: Shield,
  title: 'Secure & Private',
  description: 'Your health data is encrypted and protected at all times'
}, {
  icon: Clock,
  title: '24/7 Access',
  description: 'Access your health records and book appointments anytime'
}];
const stats = [{
  value: '10K+',
  label: 'Patients Served'
}, {
  value: '500+',
  label: 'Doctors'
}, {
  value: '98%',
  label: 'Satisfaction'
}, {
  value: '24/7',
  label: 'Support'
}];
export default function Landing() {
  const {
    user
  } = useAuth();
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="InstaMed Logo" className="h-10 w-10 object-contain rounded-full" />
            <span className="text-2xl font-bold text-foreground">InstaMed</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button> : <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <img src={logo} alt="InstaMed" className="w-5 h-5 object-contain" />
              Healthcare made simple
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your Health,{' '}
              <span className="text-primary">Our Priority</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Connect with qualified doctors, book appointments, and manage your health records — all in one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" asChild>
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link to="/doctors">Browse Doctors</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(64 + i)}
                  </div>)}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm text-muted-foreground">Trusted by 10,000+ patients</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Card className="shadow-xl border-none">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Dr. Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">General Practice</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Available for video consultation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>15+ years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>4.9 ★ rating (500+ reviews)</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Book Appointment</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Better Health
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools you need to manage your healthcare journey effectively.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => <motion.div key={feature.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }}>
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-muted/50 py-20">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in just three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            step: '01',
            title: 'Create Account',
            description: 'Sign up for free and complete your health profile'
          }, {
            step: '02',
            title: 'Find a Doctor',
            description: 'Browse our network of qualified healthcare professionals'
          }, {
            step: '03',
            title: 'Book & Consult',
            description: 'Schedule an appointment and get the care you need'
          }].map((item, index) => <motion.div key={item.step} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.15
          }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center bg-primary rounded-3xl p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust InstaMed for their healthcare needs.
          </p>
          <Button size="lg" variant="secondary" className="text-base" asChild>
            <Link to="/auth">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="InstaMed Logo" className="h-8 w-8 object-contain rounded-full" />
              <span className="text-lg font-bold text-foreground">InstaMed</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 InstaMed. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
}