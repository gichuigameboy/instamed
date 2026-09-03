import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, Shield, LogOut, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const { signOut } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const [notifAppointments, setNotifAppointments] = useState(true);
    const [notifReminders, setNotifReminders] = useState(true);
    const [notifMessages, setNotifMessages] = useState(false);
    const [notifMarketing, setNotifMarketing] = useState(false);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast({ title: 'Passwords do not match', variant: 'destructive' });
            return;
        }
        if (newPassword.length < 6) {
            toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
            return;
        }
        setIsUpdatingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast({ title: 'Password updated', description: 'Your password has been changed successfully.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container py-8 max-w-2xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences</p>
                </motion.div>

                <div className="space-y-6">
                    {/* Password */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-primary" />
                                    Change Password
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPasswords ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPasswords ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <Button
                                    onClick={handlePasswordChange}
                                    disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                                    className="w-full"
                                >
                                    {isUpdatingPassword ? (
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Notifications */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-primary" />
                                    Notification Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { label: 'Appointment confirmations', description: 'Get notified when appointments are confirmed', value: notifAppointments, setter: setNotifAppointments },
                                    { label: 'Appointment reminders', description: '24h and 1h before your appointment', value: notifReminders, setter: setNotifReminders },
                                    { label: 'New messages', description: 'When a doctor sends you a message', value: notifMessages, setter: setNotifMessages },
                                    { label: 'Health tips & news', description: 'Weekly health tips and platform updates', value: notifMarketing, setter: setNotifMarketing },
                                ].map((item, i) => (
                                    <div key={i}>
                                        {i > 0 && <Separator className="mb-4" />}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">{item.label}</p>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                            <Switch checked={item.value} onCheckedChange={item.setter} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Privacy & Security */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    Privacy & Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    { label: 'Privacy Policy', href: '#' },
                                    { label: 'Terms of Service', href: '#' },
                                    { label: 'Data & Permissions', href: '#' },
                                ].map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <span className="text-sm font-medium">{item.label}</span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </a>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Sign Out */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Button
                            variant="outline"
                            className="w-full h-12 text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
