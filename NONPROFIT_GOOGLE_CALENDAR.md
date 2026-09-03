# Non-Profit Healthcare Platform - Free Consultations & Google Calendar Integration

## Changes Made

### 1. FREE Consultations (Non-Profit)
- ✅ Removed consultation fees from BookingDialog
- ✅ Changed "$50" badge to "FREE"
- ✅ Updated UI to emphasize free healthcare

### 2. Google Calendar Integration
- ✅ Added `addToGoogleCalendar()` helper function
- ✅ Added "Add to Calendar" button on appointment cards
- ✅ Creates calendar event with appointment details
- ✅ Supports video calls, phone calls, and in-person appointments

### 3. Database Updates
- ✅ Added `google_calendar_event_id` column to appointments table
- ✅ Updated types.ts with new column

### 4. UI Updates
- ✅ Added CalendarPlus icon for calendar button
- ✅ Updated appointment cards with calendar integration

## Files Modified

### BookingDialog.tsx
- Removed consultation fee display
- Changed badge from `$50` to `FREE`
- Added Google Calendar integration when booking

### Appointments.tsx
- Added "Add to Google Calendar" button
- Integrated calendar event creation
- Updated appointment card with calendar action

### types.ts
- Added `google_calendar_event_id` to appointments table type

### googleCalendar.ts (NEW)
- Google Calendar API integration service
- Event creation helper
- URL generation for quick add

## Google Calendar Features

### Event Details Included:
- Appointment title (e.g., "Video Consultation with Dr. Smith")
- Date and time
- Consultation type (video/phone/in-person)
- Location/Meeting link
- Description with doctor name and specialization

### Button Action:
- Generates Google Calendar event URL
- Opens in new tab for quick add
- No authentication required for basic add-to-calendar

## Usage

### For Users:
1. Book an appointment - it's FREE
2. Click "Add to Calendar" on appointment card
3. Event opens in Google Calendar - click "Save"

### For Doctors:
1. View scheduled appointments
2. Click "Add to Calendar" to add3. All to their calendar
 appointment details auto-filled

## Next Steps (Optional)

To enable automatic calendar sync (instead of just add-to-calendar URL):
1. Set up Google Cloud Console project
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials
4. Add credentials to environment variables:
   - VITE_GOOGLE_CLIENT_ID
   - VITE_GOOGLE_CLIENT_SECRET

For now, the "Add to Calendar" button uses Google's public "Add to Calendar" URL scheme which doesn't require authentication.

