-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'admin');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table for patient/doctor basic info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create doctor_profiles table for doctor-specific info
CREATE TABLE public.doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    specialization TEXT NOT NULL DEFAULT 'General Practice',
    years_experience INTEGER DEFAULT 0,
    bio TEXT,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    working_hours_start TIME DEFAULT '09:00',
    working_hours_end TIME DEFAULT '17:00',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on doctor_profiles
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
    consultation_type TEXT NOT NULL DEFAULT 'video' CHECK (consultation_type IN ('video', 'phone', 'in-person')),
    notes TEXT,
    meeting_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create medical_records table
CREATE TABLE public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES auth.users(id),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on medical_records
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is a patient
CREATE OR REPLACE FUNCTION public.is_patient()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'patient')
$$;

-- Function to check if user is a doctor
CREATE OR REPLACE FUNCTION public.is_doctor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'doctor')
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_profiles_updated_at
    BEFORE UPDATE ON public.doctor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
    BEFORE UPDATE ON public.medical_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
    
    -- Default to patient role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'patient');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient profiles for their appointments"
    ON public.profiles FOR SELECT
    USING (
        public.is_doctor() AND EXISTS (
            SELECT 1 FROM public.appointments 
            WHERE appointments.patient_id = profiles.user_id 
            AND appointments.doctor_id = auth.uid()
        )
    );

-- RLS Policies for doctor_profiles
CREATE POLICY "Anyone authenticated can view doctor profiles"
    ON public.doctor_profiles FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Doctors can update their own profile"
    ON public.doctor_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert their own profile"
    ON public.doctor_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id AND public.is_doctor());

-- RLS Policies for appointments
CREATE POLICY "Patients can view their own appointments"
    ON public.appointments FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their appointments"
    ON public.appointments FOR SELECT
    USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments"
    ON public.appointments FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own appointments"
    ON public.appointments FOR UPDATE
    USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can update their appointments"
    ON public.appointments FOR UPDATE
    USING (auth.uid() = doctor_id);

-- RLS Policies for medical_records
CREATE POLICY "Patients can view their own records"
    ON public.medical_records FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view records for their patients"
    ON public.medical_records FOR SELECT
    USING (
        public.is_doctor() AND EXISTS (
            SELECT 1 FROM public.appointments 
            WHERE appointments.patient_id = medical_records.patient_id 
            AND appointments.doctor_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can insert medical records"
    ON public.medical_records FOR INSERT
    WITH CHECK (
        public.is_doctor() AND auth.uid() = doctor_id
    );

CREATE POLICY "Doctors can update records they created"
    ON public.medical_records FOR UPDATE
    USING (auth.uid() = doctor_id);