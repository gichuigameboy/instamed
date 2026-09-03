# Jitsi Migration - TODO

## Goal: Migrate from Daily.co to Jitsi for video consultations

### Phase 1: Create Jitsi Components
- [x] 1.1 Create `JitsiRoom.tsx` component (Jitsi iframe integration)
- [x] 1.2 Create `useJitsi.ts` hook (room management)
- [x] 1.3 Update `VideoCall.tsx` to use JitsiRoom

### Phase 2: Remove Daily.co Dependencies
- [x] 2.1 Remove `DailyRoom.tsx` component
- [x] 2.2 Remove `useDailyRoom.ts` hook
- [x] 2.3 Update imports in `VideoCall.tsx`
- [x] 2.4 Remove Daily.co dependencies from `package.json`

### Phase 3: Update Dependencies
- [x] 3.1 Run `npm install` to update package-lock.json

### Phase 4: Backend Cleanup (Optional)
- [ ] 4.1 Remove Daily.co edge functions from Supabase (optional)
- [ ] 4.2 Archive Daily.co migrations

### Phase 5: Testing
- [ ] 5.1 Test video consultation flow
- [ ] 5.2 Verify all features work (video, audio, screen share, chat)

## Jitsi Configuration
- Server: meet.jit.si (free public server)
- Room name: Generated from appointment ID (format: instamed-{appointmentId})
- User name: From authenticated user profile
- Features: Video, Audio, Screen Share, Chat

## Completed Changes
- ✅ Created `/src/components/JitsiRoom.tsx` - Full Jitsi iframe integration
- ✅ Created `/src/hooks/useJitsi.ts` - Room generation hook
- ✅ Updated `/src/pages/VideoCall.tsx` - Uses JitsiRoom instead of DailyRoom
- ✅ Removed Daily.co dependencies from package.json
- ✅ Removed DailyRoom.tsx and useDailyRoom.ts
- ✅ Ran npm install (removed 13 packages)

