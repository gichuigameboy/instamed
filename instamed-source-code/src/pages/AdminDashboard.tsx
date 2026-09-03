import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Stethoscope, Calendar, Shield, Search, MoreHorizontal, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { user, isDoctor } = useAuth(); // Normally we'd use isAdmin, but we'll use a role check
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [stats, setStats] = useState({
        total_users: 0,
        patients: 0,
        doctors: 0,
        appointments: 0,
    });
    const [usersList, setUsersList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) return;

            const { data } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .maybeSingle();

            setIsAdmin(data?.role === 'admin');
        };
        checkAdmin();
    }, [user]);

    useEffect(() => {
        if (isAdmin === false) return; // Not an admin
        if (isAdmin === true) {
            const fetchAdminData = async () => {
                // Fetch Stats
                const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { count: doctorsCount } = await supabase.from('doctor_profiles').select('*', { count: 'exact', head: true });
                const { count: aptsCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true });

                setStats({
                    total_users: usersCount || 0,
                    patients: (usersCount || 0) - (doctorsCount || 0),
                    doctors: doctorsCount || 0,
                    appointments: aptsCount || 0,
                });

                // Fetch Recent Users
                const { data: users } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(10);

                setUsersList(users || []);
                setIsLoading(false);
            };
            fetchAdminData();
        }
    }, [isAdmin]);

    if (isAdmin === false) return <Navigate to="/dashboard" replace />;
    if (isAdmin === null || isLoading) return <div className="min-h-screen flex items-center justify-center"><Activity className="w-8 h-8 text-primary animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Admin Control Center</h1>
                    </div>
                    <p className="text-muted-foreground">Monitor platform activity and manage user accounts</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Registered Patients', value: stats.patients, icon: UserCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
                        { label: 'Verified Doctors', value: stats.doctors, icon: Stethoscope, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                        { label: 'Appointments Scheduled', value: stats.appointments, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1 font-medium">{stat.label}</p>
                                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* User Management Section */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-xl font-bold text-foreground">User Management</h2>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Card className="border-none shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border">
                                        <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">User</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {usersList.map((usr) => (
                                        <tr key={usr.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={usr.avatar_url} />
                                                        <AvatarFallback>{usr.first_name?.[0]}{usr.last_name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-sm">{usr.first_name} {usr.last_name}</p>
                                                        <p className="text-xs text-muted-foreground">{usr.phone || 'No phone'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none hover:bg-green-500/10">Active</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
