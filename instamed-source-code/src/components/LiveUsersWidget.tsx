import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Activity } from 'lucide-react';
import { usePresence } from '@/lib/usePresence';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function LiveUsersWidget() {
  const { onlineUsers } = usePresence();
  const [isOpen, setIsOpen] = useState(false);

  // Separate users by role for display
  const doctors = onlineUsers.filter(u => u.role === 'doctor');
  const patients = onlineUsers.filter(u => u.role === 'patient');

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg p-3 pr-4 hover:bg-background transition-colors"
      >
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
        </div>
        <Users className="w-5 h-5 text-foreground" />
        <span className="font-semibold text-sm">
          {onlineUsers.length} Online
        </span>
      </motion.button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 w-80 rounded-xl bg-background border border-border shadow-2xl overflow-hidden flex flex-col max-h-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Live Activity</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">
              {onlineUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No one is currently online.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Doctors Section */}
                  {doctors.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Doctors ({doctors.length})
                      </h4>
                      <div className="space-y-2">
                        {doctors.map(user => (
                          <div key={user.id} className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-8 h-8 border border-border">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {user.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-background"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                Dr. {user.name}
                              </p>
                              <p className="text-xs text-muted-foreground">Online now</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patients Section (Masked Names) */}
                  {patients.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Patients ({patients.length})
                      </h4>
                      <div className="space-y-2">
                        {patients.map(user => (
                          <div key={user.id} className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-8 h-8 border border-border">
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                  P
                                </AvatarFallback>
                              </Avatar>
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-background"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                Patient (Private)
                              </p>
                              <p className="text-xs text-muted-foreground">Online now</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
