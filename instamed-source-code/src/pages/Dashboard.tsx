import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  User,
  Activity,
  ChevronRight,
  Plus,
  Bell,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';

interface Appointment {
  id: string;
  scheduled_at: string;
  status: string;
  consultation_type: string;
  doctor_id: string;
  doctor_profile?: {
    specialization: string;
  };
  doctor_info?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .order('scheduled_at', { ascending: true })
        .limit(5);

      if (!error && data) {
        // Fetch doctor profiles for each appointment
        const appointmentsWithDoctors = await Promise.all(
          data.map(async (apt) => {
            const { data: doctorProfile } = await supabase
              .from('doctor_profiles')
              .select('specialization')
              .eq('user_id', apt.doctor_id)
              .maybeSingle();

            const { data: doctorInfo } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('user_id', apt.doctor_id)
              .maybeSingle();

            return {
              ...apt,
              doctor_profile: doctorProfile,
              doctor_info: doctorInfo,
            };
          })
        );
        setAppointments(appointmentsWithDoctors);
      }
      setIsLoading(false);
    };

    fetchAppointments();
  }, [user]);

  const upcomingAppointments = appointments.filter(
    apt => new Date(apt.scheduled_at) > new Date() && apt.status !== 'cancelled'
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success/10 text-success';
      case 'scheduled': return 'bg-info/10 text-info';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getGreeting()}, {profile?.first_name || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your health dashboard
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Consultations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Records</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Good</p>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/appointments">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="w-12 h-12 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3" />
                          <div className="h-3 bg-muted rounded w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No upcoming appointments</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Book a consultation with one of our doctors
                    </p>
                    <Button asChild>
                      <Link to="/doctors">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="appointment-card flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={apt.doctor_info?.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {apt.doctor_info?.first_name?.[0]}{apt.doctor_info?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            Dr. {apt.doctor_info?.first_name} {apt.doctor_info?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {apt.doctor_profile?.specialization || 'General Practice'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{formatDate(apt.scheduled_at)}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTime(apt.scheduled_at)}
                          </div>
                        </div>
                        <Badge className={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link to="/doctors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Find a Doctor</p>
                      <p className="text-xs text-muted-foreground">Browse specialists</p>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link to="/appointments">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">My Appointments</p>
                      <p className="text-xs text-muted-foreground">View & manage</p>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link to="/ai-symptom-checker">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                      <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">AI Symptom Checker</p>
                      <p className="text-xs text-muted-foreground">Instant health insights</p>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link to="/clinics">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Clinic Finder</p>
                      <p className="text-xs text-muted-foreground">Find care near you</p>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link to="/profile">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">My Profile</p>
                      <p className="text-xs text-muted-foreground">View & edit info</p>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Health Tip */}
            <Card className="border-none shadow-sm mt-4 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Health Tip</p>
                    <p className="text-sm text-muted-foreground">
                      Remember to drink at least 8 glasses of water daily for optimal health!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
