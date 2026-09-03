-- Add patient-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS zipcode text,
ADD COLUMN IF NOT EXISTS blood_group text,
ADD COLUMN IF NOT EXISTS past_problems text;

-- Update handle_new_user to save all metadata and create doctor profile if needed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _role app_role;
BEGIN
    -- Get role from user metadata, default to 'patient'
    _role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::app_role,
      'patient'::app_role
    );

    -- Insert profile with all metadata
    INSERT INTO public.profiles (user_id, first_name, last_name, zipcode, blood_group, past_problems)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      NEW.raw_user_meta_data->>'zipcode',
      NEW.raw_user_meta_data->>'blood_group',
      NEW.raw_user_meta_data->>'past_problems'
    );
    
    -- Insert user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, _role);
    
    -- If doctor, create doctor_profiles entry
    IF _role = 'doctor' THEN
      INSERT INTO public.doctor_profiles (user_id, specialization, years_experience)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'specialization', 'General Practice'),
        COALESCE((NEW.raw_user_meta_data->>'years_experience')::integer, 0)
      );
    END IF;
    
    RETURN NEW;
END;
$function$;