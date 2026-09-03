-- Fix 1: Add INSERT policy for profiles so users can create their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Fix 2: Update doctor access to profiles - restrict to only recent/active appointments
-- First drop the existing overly permissive policy
DROP POLICY IF EXISTS "Doctors can view patient profiles for their appointments" ON public.profiles;

-- Create a more restrictive policy that limits doctor access to:
-- 1. Active appointments (scheduled or confirmed status)
-- 2. Appointments within the last 30 days (for follow-ups)
CREATE POLICY "Doctors can view patient profiles for active appointments"
ON public.profiles FOR SELECT
USING (
  is_doctor() AND (
    EXISTS (
      SELECT 1
      FROM appointments
      WHERE appointments.patient_id = profiles.user_id
        AND appointments.doctor_id = auth.uid()
        AND (
          -- Active appointments (scheduled or confirmed)
          appointments.status IN ('scheduled', 'confirmed')
          OR
          -- Recent completed appointments (within 30 days for follow-up care)
          (appointments.status = 'completed' AND appointments.scheduled_at > (now() - interval '30 days'))
        )
    )
  )
);