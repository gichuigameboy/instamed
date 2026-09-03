import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { ClinicCard } from '@/components/ClinicCard';
import { useClinicLocations } from '@/hooks/useClinicLocations';

export default function ClinicFinder() {
    const { clinics, isLoading, userLocation } = useClinicLocations();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClinics = clinics.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.specialization.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Build OSM embed URL centered on Kenya
    const centerLat = userLocation?.lat ?? -1.2864;
    const centerLng = userLocation?.lng ?? 36.8172;
    const delta = 0.15;
    const bbox = `${centerLng - delta}%2C${centerLat - delta}%2C${centerLng + delta}%2C${centerLat + delta}`;
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centerLat}%2C${centerLng}`;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <MapPin className="w-8 h-8 text-primary" />
                        Clinic Finder
                    </h1>
                    <p className="text-muted-foreground">
                        Find the nearest InstaMed clinics and partner hospitals across Kenya
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar: Search & List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, city, or specialty..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} found
                            {userLocation ? ' · Sorted by distance from you' : ''}
                        </p>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
                                ))
                            ) : filteredClinics.length === 0 ? (
                                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                                    <p className="text-muted-foreground">No clinics found</p>
                                </div>
                            ) : (
                                filteredClinics.map((clinic) => (
                                    <ClinicCard key={clinic.id} clinic={clinic} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Main Content: Map */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg h-[600px] relative">
                            {/* OpenStreetMap iframe embed - centered on Kenya */}
                            <iframe
                                title="OpenStreetMap - Kenya clinics"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                src={mapSrc}
                                className="filter brightness-95 contrast-110"
                            />

                            {/* Floating Action Button */}
                            <Button
                                className="absolute bottom-6 right-6 shadow-xl"
                                variant="secondary"
                                onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition((pos) => {
                                            const { latitude, longitude } = pos.coords;
                                            window.open(
                                                `https://www.openstreetmap.org/#map=14/${latitude}/${longitude}`,
                                                '_blank'
                                            );
                                        });
                                    }
                                }}
                            >
                                <Navigation className="w-4 h-4 mr-2" />
                                Find Near Me
                            </Button>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3 text-sm text-primary">
                            <Info className="w-5 h-5 flex-shrink-0" />
                            <p>
                                Clinics are sorted by distance from your current location. Click "Google Maps" or
                                "OpenStreetMap" on any clinic card for turn-by-turn directions.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
