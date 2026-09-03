import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Video, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { BookingDialog } from '@/components/BookingDialog';

interface Doctor {
  id: string;
  user_id: string;
  specialization: string;
  years_experience: number;
  bio: string | null;
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

const KENYA_HOSPITALS: Record<string, string> = {
  'General Practice': 'Kenyatta National Hospital, Nairobi',
  'Cardiology': 'Nairobi Hospital, Upper Hill',
  'Dermatology': 'Aga Khan University Hospital, Nairobi',
  'Pediatrics': 'Gertrude\'s Children\'s Hospital, Muthaiga',
  'Psychiatry': 'Mathare National Teaching & Referral Hospital, Nairobi',
  'Orthopedics': 'Moi Teaching & Referral Hospital, Eldoret',
  'Internal Medicine': 'MP Shah Hospital, Parklands',
  'Family Medicine': 'Karen Hospital, Karen',
  'Neurology': 'Avenue Healthcare, Parklands',
  'Oncology': 'Texas Cancer Centre, Nairobi',
};

function getHospital(specialization: string): string {
  return KENYA_HOSPITALS[specialization] || 'Kenyatta National Hospital, Nairobi';
}

const specializations = [
  'All',
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Psychiatry',
  'Orthopedics',
];

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*');

      if (!error && data) {
        // Fetch profiles for each doctor
        const doctorsWithProfiles = await Promise.all(
          data.map(async (doctor) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('user_id', doctor.user_id)
              .maybeSingle();

            return {
              ...doctor,
              profile,
            };
          })
        );
        setDoctors(doctorsWithProfiles);
      }
      setIsLoading(false);
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.profile?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.profile?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === 'All' ||
      doctor.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Find a Doctor</h1>
          <p className="text-muted-foreground">
            Browse our network of qualified healthcare professionals
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Specialization Pills */}
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSpecialization === spec
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-none shadow-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded w-2/3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              {doctors.length === 0
                ? 'No doctors are currently available. Check back later!'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={doctor.profile?.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {doctor.profile?.first_name?.[0]}
                          {doctor.profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          Dr. {doctor.profile?.first_name} {doctor.profile?.last_name}
                        </h3>
                        <Badge variant="secondary" className="mt-1">
                          {doctor.specialization}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {doctor.bio || 'Experienced healthcare professional dedicated to patient care.'}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-warning" />
                        <span>4.8 (120 reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{doctor.years_experience}+ years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="w-4 h-4" />
                        <span>Video consultation available</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span className="truncate">{getHospital(doctor.specialization)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          Free
                        </p>
                        <p className="text-xs text-muted-foreground">per session</p>
                      </div>
                      <Button onClick={() => handleBookAppointment(doctor)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <BookingDialog
        doctor={selectedDoctor}
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedDoctor(null);
        }}
      />
    </div>
  );
}
