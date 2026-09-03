import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JitsiRoom } from '@/components/JitsiRoom';
import { useAuth } from '@/lib/auth';
import { useJitsi } from '@/hooks/useJitsi';
import { supabase } from '@/integrations/supabase/client';

interface AppointmentDetail {
    id: string;
    scheduled_at: string;
    consultation_type: string;
    doctor_info?: { first_name: string; last_name: string } | null;
}

export default function VideoCall() {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [callStarted, setCallStarted] = useState(false);

    const displayName = profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
        : 'Patient';

    const { roomName, jitsiUrl } = useJitsi(appointmentId || 'default', displayName);

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!appointmentId) return;
            const { data: apt } = await supabase
                .from('appointments')
                .select('id, scheduled_at, consultation_type')
                .eq('id', appointmentId)
                .maybeSingle();

            if (apt) {
                const { data: doctorInfo } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('user_id', (apt as any).doctor_id)
                    .maybeSingle();

                setAppointment({ ...apt, doctor_info: doctorInfo });
            }
            setIsLoading(false);
        };
        fetchAppointment();
    }, [appointmentId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (callStarted) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-white font-medium text-sm">Live • {roomName}</span>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => navigate('/appointments')}
                    >
                        End Call
                    </Button>
                </div>
                <div className="flex-1">
                    <JitsiRoom jitsiUrl={jitsiUrl} roomName={roomName} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-6"
                    onClick={() => navigate('/appointments')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Appointments
                </Button>

                <div className="bg-card rounded-2xl shadow-lg p-8 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Video className="w-10 h-10 text-primary" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Video Consultation</h1>
                        {appointment?.doctor_info && (
                            <p className="text-muted-foreground">
                                with Dr. {appointment.doctor_info.first_name} {appointment.doctor_info.last_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 text-sm bg-muted/30 rounded-xl p-4 text-left">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>Joining as: <strong className="text-foreground">{displayName}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Video className="w-4 h-4" />
                            <span>Room: <strong className="text-foreground">{roomName}</strong></span>
                        </div>
                        {appointment && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                    Scheduled:{' '}
                                    <strong className="text-foreground">
                                        {new Date(appointment.scheduled_at).toLocaleString()}
                                    </strong>
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300 text-left">
                        <strong>Before you join:</strong> Make sure your camera and microphone are allowed in your browser settings.
                    </div>

                    <Button
                        className="w-full h-12 text-base"
                        onClick={() => setCallStarted(true)}
                    >
                        <Video className="w-5 h-5 mr-2" />
                        Join Video Call
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
