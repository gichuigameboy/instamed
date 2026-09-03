# Daily.co Video Consultation Integration

## Overview
Integrate Daily.co for real-time video consultations in the Instamed healthcare platform.

## Implementation Plan

### Phase 1: Backend (Supabase Edge Functions)
- [x] 1.1 Create `create-daily-room` Edge Function
- [x] 1.2 Create `get-daily-room` Edge Function
- [x] 1.3 Add Daily.co API key to Supabase secrets

### Phase 2: Frontend - Video Call Component
- [x] 2.1 Create `DailyRoom.tsx` component for video call interface
- [x] 2.2 Create `useDailyRoom.ts` hook for Daily.co room management

### Phase 3: Frontend - Pages and Updates
- [x] 3.1 Create `VideoCall.tsx` page for video consultations
- [x] 3.2 Update `Appointments.tsx` to generate meeting links
- [x] 3.3 Update `App.tsx` with video call routes

### Phase 4: Database Schema
- [x] 4.1 Add `room_name` and `room_url` fields to appointments table

## Daily.co Setup
1. Sign up at https://daily.co
2. Get your API key from https://dashboard.daily.co
3. Add the API key to Supabase secrets:
   ```bash
   supabase secrets set DAILY_API_KEY=your_api_key
   supabase secrets set DAILY_API_URL=https://api.daily.co/v1
   ```

## Files Created/Modified
- ✅ Created: `supabase/functions/create-daily-room/index.ts`
- ✅ Created: `supabase/functions/get-daily-room/index.ts`
- ✅ Created: `instamed-source-code/src/components/DailyRoom.tsx`
- ✅ Created: `instamed-source-code/src/hooks/useDailyRoom.ts`
- ✅ Created: `instamed-source-code/src/pages/VideoCall.tsx`
- ✅ Modified: `instamed-source-code/src/pages/Appointments.tsx`
- ✅ Modified: `instamed-source-code/src/App.tsx`
- ✅ Created: `supabase/migrations/20260127000000_daily_co_rooms.sql`

## Testing Instructions
1. Deploy the Supabase Edge Functions
2. Run the database migration
3. Add Daily.co API key to Supabase secrets
4. Test video consultation flow:
   - Create a video appointment
   - Click "Join Video Call" button
   - Verify Daily.co room is created
   - Test audio/video controls
   - Test screen sharing
   - Test leaving the call

## API Endpoints
- `create-daily-room`: Creates a new Daily.co room for an appointment
- `get-daily-room`: Gets or creates a room and generates a meeting token

## Environment Variables Required
- `DAILY_API_KEY`: Your Daily.co API key
- `DAILY_API_URL`: Daily.co API URL (default: https://api.daily.co/v1)

