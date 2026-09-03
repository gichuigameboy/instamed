import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, Video, Phone, MapPin, MoreVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Appointment {
  id: string;
  scheduled_at: string;
  status: string;
  consultation_type: string;
  doctor_id: string;
  notes: string | null;
  doctor_profile?: {
    specialization: string;
  };
  doctor_info?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export default function Appointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', user.id)
      .order('scheduled_at', { ascending: true });

    if (!error && data) {
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

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelAppointment = async (appointmentId: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Appointment cancelled',
        description: 'Your appointment has been cancelled',
      });
      fetchAppointments();
    }
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.scheduled_at) > now && apt.status !== 'cancelled'
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.scheduled_at) <= now || apt.status === 'cancelled'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'scheduled':
        return 'bg-info/10 text-info border-info/20';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'phone':
        return Phone;
      default:
        return MapPin;
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const TypeIcon = getTypeIcon(appointment.consultation_type);
    const isPast = new Date(appointment.scheduled_at) <= now;
    const isCancelled = appointment.status === 'cancelled';

    return (
      <Card className={`border-none shadow-sm ${isPast || isCancelled ? 'opacity-60' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-14 h-14">
              <AvatarImage src={appointment.doctor_info?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {appointment.doctor_info?.first_name?.[0]}
                {appointment.doctor_info?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-foreground">
                  Dr. {appointment.doctor_info?.first_name} {appointment.doctor_info?.last_name}
                </h3>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {appointment.doctor_profile?.specialization || 'General Practice'}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(appointment.scheduled_at), 'EEE, MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {format(new Date(appointment.scheduled_at), 'h:mm a')}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TypeIcon className="w-4 h-4" />
                  {appointment.consultation_type === 'video'
                    ? 'Video Call'
                    : appointment.consultation_type === 'phone'
                      ? 'Phone Call'
                      : 'In-Person'}
                </div>
              </div>
            </div>

            {!isPast && !isCancelled && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="text-destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Appointment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {!isPast && !isCancelled && appointment.consultation_type === 'video' && (
            <div className="mt-4 pt-4 border-t border-border">
              <Button className="w-full" variant="outline" asChild>
                <Link to={`/video-call/${appointment.id}`}>
                  <Video className="w-4 h-4 mr-2" />
                  Join Video Call
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">My Appointments</h1>
          <p className="text-muted-foreground">
            Manage your upcoming and past appointments
          </p>
        </motion.div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-none shadow-sm animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-muted rounded w-1/3" />
                          <div className="h-4 bg-muted rounded w-1/4" />
                          <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No upcoming appointments
                </h3>
                <p className="text-muted-foreground mb-6">
                  Book a consultation with one of our doctors
                </p>
                <Button asChild>
                  <Link to="/doctors">Find a Doctor</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AppointmentCard appointment={apt} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastAppointments.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No past appointments
                </h3>
                <p className="text-muted-foreground">
                  Your completed appointments will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((apt) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AppointmentCard appointment={apt} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
