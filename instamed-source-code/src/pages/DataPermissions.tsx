import { motion } from 'framer-motion';
import { Database, MapPin, Camera, Heart, Bell, UserCircle, Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Permission {
    icon: React.ReactNode;
    title: string;
    required: boolean;
    whatWeCollect: string;
    whyWeNeedIt: string;
    howToManage: string;
}

const permissions: Permission[] = [
    {
        icon: <MapPin className="w-6 h-6" />,
        title: 'Location Data',
        required: false,
        whatWeCollect: 'Your approximate geographic coordinates via your browser\'s geolocation API.',
        whyWeNeedIt: 'To power the Clinic Finder feature — showing you nearby hospitals and clinics across Kenya, sorted by distance from your current location.',
        howToManage: 'You can deny location access when your browser prompts you. The Clinic Finder will default to showing clinics around Nairobi. You can revoke location access in your browser settings at any time.',
    },
    {
        icon: <Camera className="w-6 h-6" />,
        title: 'Camera & Photos',
        required: false,
        whatWeCollect: 'Images you choose to upload through the AI Symptom Checker.',
        whyWeNeedIt: 'To allow our AI to analyse visual symptoms (e.g., skin conditions, injuries) and provide more accurate health insights.',
        howToManage: 'Image upload is entirely voluntary. We only access images you explicitly select. Images are processed for analysis and are not stored permanently on our servers.',
    },
    {
        icon: <Heart className="w-6 h-6" />,
        title: 'Health Information',
        required: false,
        whatWeCollect: 'Symptoms you describe in the AI Symptom Checker, appointment history, consultation notes, and any medical records shared with your doctor.',
        whyWeNeedIt: 'To provide AI-powered health insights, maintain your appointment history, and enable your doctors to deliver better care through access to your health context.',
        howToManage: 'You choose what symptoms to share with the AI Checker. Medical records are only shared with doctors you book appointments with. You can request deletion of your health data by contacting support.',
    },
    {
        icon: <Bell className="w-6 h-6" />,
        title: 'Notifications',
        required: false,
        whatWeCollect: 'Your notification preferences and device tokens for push notifications.',
        whyWeNeedIt: 'To send you appointment reminders, booking confirmations, doctor messages, and important service updates.',
        howToManage: 'You can enable or disable notifications in your browser settings. Email notifications can be managed in your InstaMed profile settings.',
    },
    {
        icon: <UserCircle className="w-6 h-6" />,
        title: 'Account & Profile Data',
        required: true,
        whatWeCollect: 'Name, email address, phone number, date of birth, gender, blood group, and profile photo.',
        whyWeNeedIt: 'To create and maintain your account, verify your identity, personalise your experience, and enable doctors to identify you during consultations.',
        howToManage: 'You can update your profile information from the Profile page. To delete your account and all associated data, contact support@instamed.co.ke.',
    },
    {
        icon: <Lock className="w-6 h-6" />,
        title: 'Authentication Data',
        required: true,
        whatWeCollect: 'Email and password (hashed and salted — we never store plain-text passwords), session tokens, and login history.',
        whyWeNeedIt: 'To securely authenticate you, protect your account from unauthorised access, and maintain active sessions across devices.',
        howToManage: 'You can change your password from the Settings page. You can sign out of all sessions by changing your password.',
    },
];

export default function DataPermissions() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8 max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Database className="w-8 h-8 text-primary" />
                        Data Permissions
                    </h1>
                    <p className="text-muted-foreground">Last updated: September 2, 2026</p>
                </motion.div>

                {/* Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Card className="border-none shadow-sm bg-primary/5">
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                InstaMed requests only the permissions necessary to provide you with a seamless
                                healthcare experience. Below is a transparent breakdown of every type of data we may
                                access, why we need it, and how you can control it. Most permissions are{' '}
                                <Badge variant="outline" className="text-xs">Optional</Badge> — you
                                can use InstaMed without granting them, though some features may be limited.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Permission Cards */}
                <div className="space-y-6">
                    {permissions.map((perm, index) => (
                        <motion.div
                            key={perm.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * (index + 2) }}
                        >
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                {perm.icon}
                                            </div>
                                            <CardTitle className="text-lg">{perm.title}</CardTitle>
                                        </div>
                                        <Badge variant={perm.required ? 'default' : 'outline'} className="text-xs">
                                            {perm.required ? 'Required' : 'Optional'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">
                                            What we collect
                                        </p>
                                        <p className="text-sm text-muted-foreground">{perm.whatWeCollect}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">
                                            Why we need it
                                        </p>
                                        <p className="text-sm text-muted-foreground">{perm.whyWeNeedIt}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">
                                            How to manage
                                        </p>
                                        <p className="text-sm text-muted-foreground">{perm.howToManage}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Data Processing Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Data Processing & Storage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Your data is processed in accordance with the Kenya Data Protection Act, 2019. Our
                                backend infrastructure is powered by Supabase, which provides enterprise-grade security
                                including row-level security policies, encrypted data storage, and secure authentication.
                                All data transfers are encrypted using TLS 1.3. For questions about our data practices,
                                contact us at <strong className="text-foreground">support@instamed.co.ke</strong>.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
