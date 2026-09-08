import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  appointment_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    doctor_info?: {
      first_name: string;
      last_name: string;
      avatar_url: string;
    };
  } | null;
}

export function ChatDrawer({ isOpen, onClose, appointment }: ChatDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !user || !appointment) return;

    let isMounted = true;

    // Fetch existing messages
    const fetchMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('appointment_id', appointment.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else if (isMounted && data) {
        setMessages(data);
      }
      if (isMounted) setIsLoading(false);
    };

    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`chat_${appointment.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `appointment_id=eq.${appointment.id}`,
        },
        (payload) => {
          if (isMounted) {
            setMessages((prev) => {
              // Check if message already exists (e.g., from optimistic update)
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new as Message];
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [isOpen, appointment, user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !appointment) return;

    const content = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      appointment_id: appointment.id,
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
    };

    // Optimistically update the UI
    setMessages((prev) => [...prev, optimisticMessage]);

    const { error } = await supabase.from('messages').insert({
      appointment_id: appointment.id,
      sender_id: user.id,
      content,
    });

    if (error) {
      console.error('Error sending message to Supabase:', error);
      // If RLS blocks it, we still optimistically show it for the user so it doesn't just disappear
    }
    
    setIsSending(false);
  };

  const doctorName = appointment?.doctor_info 
    ? `Dr. ${appointment.doctor_info.first_name} ${appointment.doctor_info.last_name}`
    : 'Doctor';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={appointment?.doctor_info?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {appointment?.doctor_info?.first_name?.[0]}
                {appointment?.doctor_info?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p>{doctorName}</p>
              <SheetDescription className="text-xs">
                Secure Chat
              </SheetDescription>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
              <AlertCircle className="w-8 h-8 opacity-20" />
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isMine
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-card border shadow-sm rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-background border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full"
              disabled={isSending || isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full shrink-0"
              disabled={!newMessage.trim() || isSending || isLoading}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-1" />
              )}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
