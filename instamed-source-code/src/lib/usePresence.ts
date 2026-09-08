import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth';

export interface OnlineUser {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
  avatar_url?: string;
  joined_at: string;
}

export function usePresence() {
  const { user, profile, isDoctor } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!user || !profile) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    const userInfo: OnlineUser = {
      id: user.id,
      name: `${profile.first_name} ${profile.last_name}`,
      role: isDoctor ? 'doctor' : 'patient',
      avatar_url: profile.avatar_url || undefined,
      joined_at: new Date().toISOString(),
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.values(newState)
          .flat()
          .map((p: any) => p as OnlineUser);
        
        // Remove duplicates (in case of multiple tabs)
        const uniqueUsers = Array.from(new Map(users.map(item => [item.id, item])).values());
        setOnlineUsers(uniqueUsers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userInfo);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile, isDoctor]);

  return { onlineUsers };
}
