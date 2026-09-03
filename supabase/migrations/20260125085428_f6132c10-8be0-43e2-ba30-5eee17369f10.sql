-- Update the handle_new_user function to read role from user metadata
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

    INSERT INTO public.profiles (user_id, first_name, last_name)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name'
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, _role);
    
    RETURN NEW;
END;
$function$;