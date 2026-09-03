# OpenStreetMap Migration Plan

## Goal: Complete switch from Google Maps to OpenStreetMap

### Phase 1: Replace Google Maps Directions Links
- [x] Update ClinicCard.tsx - Change directions links to OpenStreetMap
- [x] Update ClinicFinder.tsx - Change directions links to OpenStreetMap

### Phase 2: Replace Google Places Autocomplete with OpenStreetMap Nominatim
- [ ] Create new AddressAutocomplete component using OpenStreetMap Nominatim API
- [ ] Update Auth.tsx to use the new component
- [ ] Remove Google Maps API dependency

### Phase 3: Use User's Zipcode for Initial Map Location
- [ ] Create a hook to geocode zipcode to coordinates
- [ ] Update ClinicMap.tsx to accept initial center from user location
- [ ] Update ClinicFinder.tsx to use user's zipcode for initial map center

### Phase 4: Cleanup
- [ ] Remove Google Maps API types from package.json
- [ ] Update LEAFLET_INTEGRATION_TODO.md
- [ ] Clean up unused Google Maps code

## Files to Modify
1. `instamed-source-code/src/components/ClinicCard.tsx`
2. `instamed-source-code/src/pages/ClinicFinder.tsx`
3. `instamed-source-code/src/components/AddressAutocomplete.tsx` - Replace with OSM version
4. `instamed-source-code/src/hooks/useZipcodeLocation.ts` - New file
5. `instamed-source-code/src/components/ClinicMap.tsx` - Update for user location
6. `instamed-source-code/src/pages/Auth.tsx` - Update for new AddressAutocomplete

## Files to Delete
1. `instamed-source-code/src/components/AddressAutocomplete.tsx` (old)
2. Remove `@types/google.maps` from package.json

