/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Load Google Maps script dynamically
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.maps?.places) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
};

interface AddressComponents {
  streetNumber?: string;
  route?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  formattedAddress?: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (components: AddressComponents) => void;
  onZipcodeChange?: (zipcode: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  onZipcodeChange,
  placeholder = 'Start typing your address...',
  className,
  required,
  disabled,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const parseAddressComponents = useCallback((place: any): AddressComponents => {
    const components: AddressComponents = {
      formattedAddress: place.formatted_address,
    };

    if (place.address_components) {
      for (const component of place.address_components) {
        const types = component.types;
        
        if (types.includes('street_number')) {
          components.streetNumber = component.long_name;
        } else if (types.includes('route')) {
          components.route = component.long_name;
        } else if (types.includes('locality')) {
          components.city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          components.state = component.short_name;
        } else if (types.includes('country')) {
          components.country = component.long_name;
        } else if (types.includes('postal_code')) {
          components.zipcode = component.long_name;
        }
      }
    }

    return components;
  }, []);

  useEffect(() => {
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    setIsLoading(true);
    loadGoogleMapsScript(apiKey)
      .then(() => {
        setIsScriptLoaded(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [apiKey]);

  useEffect(() => {
    if (!isScriptLoaded || !inputRef.current || autocompleteRef.current) return;

    const google = (window as any).google;
    if (!google?.maps?.places) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['address_components', 'formatted_address', 'geometry'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }

      const components = parseAddressComponents(place);
      
      if (onAddressSelect) {
        onAddressSelect(components);
      }

      if (onZipcodeChange && components.zipcode) {
        onZipcodeChange(components.zipcode);
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current && google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isScriptLoaded, onChange, onAddressSelect, onZipcodeChange, parseAddressComponents]);

  if (!apiKey) {
    return (
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter zipcode manually"
          className={cn('pl-10', className)}
          required={required}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Address autocomplete unavailable - enter zipcode manually
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
      )}
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn('pl-10', className)}
        required={required}
        disabled={disabled || isLoading}
      />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
