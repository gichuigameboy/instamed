import { useState } from 'react';
import { format, addDays, setHours, setMinutes, isBefore, startOfToday } from 'date-fns';
import { Calendar, Clock, Video, Phone, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  user_id: string;
  specialization: string;
  years_experience: number;
  consultation_fee: number;
  available_days: string[];
  working_hours_start: string;
  working_hours_end: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

interface BookingDialogProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

const consultationTypes = [
  { id: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face online' },
  { id: 'phone', label: 'Phone Call', icon: Phone, description: 'Voice consultation' },
  { id: 'in-person', label: 'In-Person', icon: MapPin, description: 'Visit the clinic' },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export function BookingDialog({ doctor, isOpen, onClose }: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('video');
  const [isBooking, setIsBooking] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate next 7 days for date selection
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i + 1));

  const handleBook = async () => {
    if (!doctor || !selectedDate || !selectedTime || !user) return;

    setIsBooking(true);

    try {
      // Parse the time slot
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: doctor.user_id,
        scheduled_at: scheduledAt.toISOString(),
        consultation_type: selectedType,
        status: 'scheduled',
      });

      if (error) throw error;

      toast({
        title: 'Appointment booked!',
        description: `Your appointment with Dr. ${doctor.profile?.first_name} ${doctor.profile?.last_name} is confirmed.`,
      });

      onClose();
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      navigate('/appointments');
    } catch (error: any) {
      toast({
        title: 'Booking failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    onClose();
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule a consultation with Dr. {doctor.profile?.first_name} {doctor.profile?.last_name}
          </DialogDescription>
        </DialogHeader>

        {/* Doctor Info */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
          <Avatar className="w-12 h-12">
            <AvatarImage src={doctor.profile?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {doctor.profile?.first_name?.[0]}
              {doctor.profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              Dr. {doctor.profile?.first_name} {doctor.profile?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
          </div>
          <Badge className="ml-auto bg-green-600">Free</Badge>
        </div>

        {/* Step 1: Select Consultation Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-medium">Select Consultation Type</h4>
            <div className="grid gap-3">
              {consultationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    selectedType === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <type.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  {selectedType === type.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {availableDates.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <p className="text-xs font-medium">{format(date, 'EEE')}</p>
                  <p className="text-lg font-bold">{format(date, 'd')}</p>
                  <p className="text-xs">{format(date, 'MMM')}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDate}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Time */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Select Time
            </h4>
            <p className="text-sm text-muted-foreground">
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedTime === time
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleBook}
                disabled={!selectedTime || isBooking}
                className="flex-1"
              >
                {isBooking ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
