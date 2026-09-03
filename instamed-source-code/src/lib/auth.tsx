import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isDoctor: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({ id: 'mock-user-id', email: 'test@example.com' } as any);
  const [session, setSession] = useState<Session | null>({ access_token: 'mock-token', user: { id: 'mock-user-id' } } as any);
  const [profile, setProfile] = useState<Profile | null>({
    id: 'mock-profile-id',
    user_id: 'mock-user-id',
    first_name: 'Test',
    last_name: 'User',
    phone: '1234567890',
    date_of_birth: '1990-01-01',
    gender: 'Other',
    avatar_url: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctor, setIsDoctor] = useState(true); // Set to true to test admin/doctor features

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }

    // Check if user is a doctor
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    setIsDoctor(roleData?.role === 'doctor');
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
          setIsDoctor(false);
        }

        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
        data: {
          first_name: metadata?.firstName,
          last_name: metadata?.lastName,
          role: metadata?.role || 'patient',
          zipcode: metadata?.zipcode,
          blood_group: metadata?.bloodGroup,
          past_problems: metadata?.pastProblems,
          specialization: metadata?.specialization,
          years_experience: metadata?.yearsExperience,
        },
      },
    });

    // Send custom verification email if signup was successful
    if (!error && data.user) {
      try {
        const confirmationUrl = `${window.location.origin}/verify-email?token_hash=${data.session?.access_token || ''}&type=email`;

        await supabase.functions.invoke('send-verification-email', {
          body: {
            email,
            firstName: metadata?.firstName || '',
            confirmationUrl,
          },
        });
      } catch (emailError) {
        console.error('Failed to send custom verification email:', emailError);
        // Don't fail the signup if email sending fails - Supabase sends its own email as fallback
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsDoctor(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isDoctor,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
