import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Loader2, MessageSquare, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatDrawer } from '@/components/ChatDrawer';

interface Profile {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

interface Appointment {
  id: string;
  status: string;
  patient_id: string;
  doctor_id: string;
  patient_info?: Profile;
  doctor_info?: Profile;
  created_at: string;
}

export default function Messages() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    id: string;
    doctor_info?: {
      first_name: string;
      last_name: string;
      avatar_url: string;
    };
  } | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .or(`patient_id.eq.${user.id},doctor_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chats:', error);
      } else if (data) {
        const appointmentsWithProfiles = await Promise.all(
          data.map(async (apt) => {
            const { data: patientInfo } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('user_id', apt.patient_id)
              .maybeSingle();

            const { data: doctorInfo } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('user_id', apt.doctor_id)
              .maybeSingle();

            return {
              ...apt,
              patient_info: patientInfo,
              doctor_info: doctorInfo,
            };
          })
        );
        setAppointments(appointmentsWithProfiles as any);
      }
      setIsLoading(false);
    };

    fetchAppointments();
  }, [user]);

  const openChat = (app: Appointment) => {
    // If the current user is the patient, they chat with the doctor.
    // If they are the doctor, they chat with the patient.
    const isDoctor = profile?.role === 'doctor';
    
    // The ChatDrawer expects doctor_info to be the person they are talking to.
    // So if the current user is a doctor, we pass the patient's info as "doctor_info" to reuse the component nicely.
    const partnerInfo = isDoctor ? app.patient_info : app.doctor_info;

    setSelectedAppointment({
      id: app.id,
      doctor_info: {
        first_name: partnerInfo?.first_name || '',
        last_name: partnerInfo?.last_name || '',
        avatar_url: partnerInfo?.avatar_url || '',
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Messages
          </h1>
          <p className="text-muted-foreground mt-2">
            Continue your conversations regarding your appointments.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No active chats</h3>
            <p className="text-muted-foreground mt-1">
              You haven't booked any appointments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app, idx) => {
              const isDoctor = profile?.role === 'doctor';
              const partner = isDoctor ? app.patient_info : app.doctor_info;
              
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                    onClick={() => openChat(app)}
                  >
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border">
                          <AvatarImage src={partner?.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {partner?.first_name?.[0]}
                            {partner?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {!isDoctor && "Dr. "}
                            {partner?.first_name} {partner?.last_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              app.status === 'scheduled' ? 'default' :
                              app.status === 'completed' ? 'secondary' :
                              'outline'
                            } className="text-[10px] uppercase">
                              {app.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(app.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block text-muted-foreground">
                        <MessageSquare className="w-5 h-5 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Reusing our ChatDrawer component */}
      <ChatDrawer
        isOpen={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
