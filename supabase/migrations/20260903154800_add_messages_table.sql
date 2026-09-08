CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages for their appointments (both patient and doctor)
CREATE POLICY "Users can view messages for their appointments" 
    ON public.messages 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.appointments a
            WHERE a.id = messages.appointment_id
            AND (a.patient_id = auth.uid() OR a.doctor_id = auth.uid())
        )
    );

-- Policy: Users can insert messages for their appointments
CREATE POLICY "Users can insert messages for their appointments" 
    ON public.messages 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.appointments a
            WHERE a.id = messages.appointment_id
            AND (a.patient_id = auth.uid() OR a.doctor_id = auth.uid())
        )
        AND sender_id = auth.uid()
    );

-- Add indexes for better query performance
CREATE INDEX idx_messages_appointment_id ON public.messages(appointment_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
