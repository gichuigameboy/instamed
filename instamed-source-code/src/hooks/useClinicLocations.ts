import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { supabase } from '@/integrations/supabase/client';

export interface Clinic {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    latitude: number;
    longitude: number;
    specialization: string[];
    distance?: number;
}

const KENYA_CLINICS: Clinic[] = [
    {
        id: '1',
        name: 'Kenyatta National Hospital',
        address: 'Hospital Rd, Upper Hill',
        city: 'Nairobi',
        phone: '+254 709 854 000',
        latitude: -1.3011,
        longitude: 36.8065,
        specialization: ['General Practice', 'Pediatrics', 'Cardiology'],
    },
    {
        id: '2',
        name: 'Nairobi Hospital',
        address: 'Argwings Kodhek Rd, Upper Hill',
        city: 'Nairobi',
        phone: '+254 703 082 000',
        latitude: -1.2946,
        longitude: 36.8088,
        specialization: ['Cardiology', 'Orthopedics', 'Oncology'],
    },
    {
        id: '3',
        name: 'Aga Khan University Hospital',
        address: '3rd Parklands Ave, Limuru Rd',
        city: 'Nairobi',
        phone: '+254 111 011 888',
        latitude: -1.2617,
        longitude: 36.8178,
        specialization: ['Dermatology', 'Internal Medicine', 'Neurology'],
    },
    {
        id: '4',
        name: 'Gertrude\'s Children\'s Hospital',
        address: 'Muthaiga Rd',
        city: 'Nairobi',
        phone: '+254 709 529 000',
        latitude: -1.2489,
        longitude: 36.8218,
        specialization: ['Pediatrics', 'General Practice'],
    },
    {
        id: '5',
        name: 'MP Shah Hospital',
        address: 'Shivachi Rd, Parklands',
        city: 'Nairobi',
        phone: '+254 111 000 600',
        latitude: -1.2633,
        longitude: 36.8145,
        specialization: ['Internal Medicine', 'Cardiology'],
    },
    {
        id: '6',
        name: 'Karen Hospital',
        address: 'Langata Rd, Karen',
        city: 'Nairobi',
        phone: '+254 709 382 000',
        latitude: -1.3198,
        longitude: 36.7076,
        specialization: ['Family Medicine', 'Orthopedics'],
    },
    {
        id: '7',
        name: 'Moi Teaching & Referral Hospital',
        address: 'Nandi Rd',
        city: 'Eldoret',
        phone: '+254 722 209 795',
        latitude: 0.5143,
        longitude: 35.2817,
        specialization: ['Orthopedics', 'General Practice', 'Psychiatry'],
    },
    {
        id: '8',
        name: 'Coast General Teaching & Referral Hospital',
        address: 'Moi Ave',
        city: 'Mombasa',
        phone: '+254 722 207 868',
        latitude: -4.0574,
        longitude: 39.6834,
        specialization: ['General Practice', 'Pediatrics'],
    },
    {
        id: '9',
        name: 'Coptic Hospital',
        address: 'Ngong Rd',
        city: 'Nairobi',
        phone: '+254 711 043 000',
        latitude: -1.2966,
        longitude: 36.7974,
        specialization: ['General Practice', 'Family Medicine'],
    },
    {
        id: '10',
        name: 'Avenue Healthcare - Parklands',
        address: '1st Parklands Ave',
        city: 'Nairobi',
        phone: '+254 711 060 100',
        latitude: -1.2595,
        longitude: 36.8177,
        specialization: ['Neurology', 'Dermatology', 'Internal Medicine'],
    },
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function useClinicLocations() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Get user location
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // In a browser this prompts the web permission, on mobile it prompts the native OS permission.
                const coordinates = await Geolocation.getCurrentPosition();
                setUserLocation({ lat: coordinates.coords.latitude, lng: coordinates.coords.longitude });
            } catch (error) {
                console.warn('Geolocation error or denied, defaulting to Nairobi CBD', error);
                // Default to Nairobi CBD if geolocation denied or fails
                setUserLocation({ lat: -1.2864, lng: 36.8172 });
            }
        };

        fetchLocation();
    }, []);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const { data, error } = await supabase
                    .from('clinic_locations')
                    .select('*');

                if (error || !data || data.length === 0) {
                    applyClinics(KENYA_CLINICS);
                } else {
                    applyClinics(data as unknown as Clinic[]);
                }
            } catch {
                applyClinics(KENYA_CLINICS);
            } finally {
                setIsLoading(false);
            }
        };

        const applyClinics = (list: Clinic[]) => {
            if (userLocation) {
                const withDistance = list.map((c) => ({
                    ...c,
                    distance: getDistanceKm(userLocation.lat, userLocation.lng, c.latitude, c.longitude),
                }));
                withDistance.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
                setClinics(withDistance);
            } else {
                setClinics(list);
            }
        };

        fetchClinics();
    }, [userLocation]);

    return { clinics, isLoading, userLocation };
}
