import { MapPin, Phone, Navigation, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clinic } from '@/hooks/useClinicLocations';

interface ClinicCardProps {
    clinic: Clinic;
}

export function ClinicCard({ clinic }: ClinicCardProps) {
    const openDirections = () => {
        // Try Google Maps first (most users have it), fallback to OSM
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}&travelmode=driving`;
        window.open(googleMapsUrl, '_blank');
    };

    const openOSMDirections = () => {
        const url = `https://www.openstreetmap.org/directions?from=&to=${clinic.latitude}%2C${clinic.longitude}#map=15/${clinic.latitude}/${clinic.longitude}`;
        window.open(url, '_blank');
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold">{clinic.name}</CardTitle>
                    {clinic.distance !== undefined && (
                        <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                            {clinic.distance < 1
                                ? `${Math.round(clinic.distance * 1000)}m`
                                : `${clinic.distance.toFixed(1)} km`}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{clinic.address}, {clinic.city}</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                    {clinic.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-[10px]">
                            {spec}
                        </Badge>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-foreground">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{clinic.phone}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button size="sm" onClick={openDirections} className="flex-1">
                        <Navigation className="w-3 h-3 mr-2" />
                        Google Maps
                    </Button>
                    <Button size="sm" variant="outline" onClick={openOSMDirections} className="flex-1">
                        <Navigation className="w-3 h-3 mr-2" />
                        OpenStreetMap
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
