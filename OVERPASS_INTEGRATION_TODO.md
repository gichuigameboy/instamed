# Overpass API Integration Plan

## Goal: Fetch real-time clinic/healthcare facility data from OpenStreetMap using Overpass API

## Implementation Status

### Phase 1: Create Overpass API Hook ✅
- [x] 1.1 Create `useOverpassClinics.ts` hook
- [x] 1.2 Implement Overpass QL queries for healthcare facilities
- [x] 1.3 Add caching and debouncing
- [x] 1.4 Handle rate limiting and errors

### Phase 2: Update Map Component ✅
- [x] 2.1 Modify `ClinicMap.tsx` to use Overpass data
- [x] 2.2 Update marker rendering for Overpass format
- [x] 2.3 Add loading states and error handling
- [x] 2.4 Implement helper functions for type-safe property access

### Phase 3: Update Pages and Components ✅
- [x] 3.1 Update `ClinicFinder.tsx` to use Overpass
- [x] 3.2 Update `ClinicCard.tsx` for Overpass data format
- [x] 3.3 Update types.ts with OverpassClinic interface
- [x] 3.4 Add helper functions for clinic type compatibility

### Phase 4: Advanced Features (Pending)
- [ ] 4.1 Add specialty-based filtering (GP, Dental, Pharmacy, etc.)
- [ ] 4.2 Add search by name or service type
- [ ] 4.3 Implement radius-based search around user location
- [ ] 4.4 Add operating hours filtering

### Phase 5: Testing and Documentation (Pending)
- [ ] 5.1 Test Overpass API queries
- [ ] 5.2 Verify marker rendering and popups
- [ ] 5.3 Update LEAFLET_INTEGRATION_TODO.md
- [ ] 5.4 Create API usage documentation

## Files Created
1. `instamed-source-code/src/hooks/useOverpassClinics.ts` - Main Overpass API hook

## Files Modified
1. `instamed-source-code/src/components/ClinicMap.tsx` - Supports both clinic types
2. `instamed-source-code/src/pages/ClinicFinder.tsx` - Uses Overpass API
3. `instamed-source-code/src/components/ClinicCard.tsx` - Supports both clinic types
4. `instamed-source-code/src/integrations/supabase/types.ts` - Added OverpassClinic type

## Overpass QL Query Examples

### Basic Healthcare Search
```overpassql
[out:json][timeout:25];
(
  node["amenity"="clinic"]({{bbox}});
  node["amenity"="hospital"]({{bbox}});
  node["healthcare"]({{bbox}});
  way["amenity"="clinic"]({{bbox}});
  way["amenity"="hospital"]({{bbox}});
  way["healthcare"]({{bbox}});
);
out center;
```

### Detailed Search with Filters
```overpassql
[out:json][timeout:25];
(
  node["amenity"="clinic"]["name"~"medical",i]({{bbox}});
  node["healthcare"="centre"]({{bbox}});
  node["amenity"="doctors"]({{bbox}});
);
out center;
```

### Search Around Location
```overpassql
[out:json][timeout:25];
(
  node["amenity"="clinic"](around:{{radius}},{{lat}},{{lon}});
  way["amenity"="clinic"](around:{{radius}},{{lat}},{{lon}});
);
out center;
```

## Data Mapping

### OpenStreetMap Tags to App Fields
| OSM Tag | App Field | Notes |
|---------|-----------|-------|
| `name` | name | Facility name |
| `amenity` | type | clinic, hospital, doctors, pharmacy |
| `healthcare` | specialty | GP, dentist, pharmacy, etc. |
| `phone` | phone | Contact number |
| `opening_hours` | operating_hours | Convert OSM format to app format |
| `addr:street` | address | Street address |
| `addr:city` | city | City name |
| `addr:postcode` | zipcode | Postal code |
| `website` | website | Facility website |
| `rating` | rating | If available |

## Files to Create
1. `src/hooks/useOverpassClinics.ts` - Main Overpass API hook

## Files to Modify
1. `src/components/ClinicMap.tsx` - Use Overpass data
2. `src/pages/ClinicFinder.tsx` - Integrate Overpass search
3. `src/components/ClinicCard.tsx` - Support Overpass format
4. `src/hooks/useClinicLocations.ts` - Combine/supplement with Overpass
5. `src/components/AddressAutocomplete.tsx` - Add healthcare facility search

## Files to Reference (No Changes)
- `src/hooks/useZipcodeGeocoder.ts` - Keep using Nominatim
- `src/hooks/useUserLocation.ts` - Keep for user location
- `src/hooks/useGeolocation.ts` - Keep for browser geolocation

## Running the Project
1. `npm run dev`
2. Navigate to `/clinics`
3. Map will now show real clinics from OpenStreetMap
4. Search by specialty, name, or location

## API Rate Limits
- Overpass API: ~1 request per second recommended
- Implement debouncing to avoid hitting limits
- Consider caching results locally

## Error Handling
- Show loading state while fetching
- Fallback to cached data if available
- Display error message if API fails
- Fallback to Supabase data if Overpass fails

