import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
    {
        title: '1. Introduction',
        content:
            'InstaMed ("we", "our", "us") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare platform, in accordance with the Kenya Data Protection Act, 2019.',
    },
    {
        title: '2. Information We Collect',
        content: `We may collect the following categories of information:

• **Personal Information** — Name, email address, phone number, date of birth, gender, and profile photo.
• **Health Data** — Symptoms you describe, images you upload for AI analysis, appointment history, and medical records shared with your healthcare provider.
• **Location Data** — Your approximate location (with your permission) to help you find nearby clinics across Kenya.
• **Usage Data** — Pages visited, features used, time spent on the platform, and interaction patterns.
• **Device Information** — Browser type, operating system, IP address, and device identifiers.`,
    },
    {
        title: '3. How We Use Your Information',
        content: `We use the information we collect to:

• Provide, maintain, and improve our healthcare services.
• Facilitate appointment booking and video consultations with doctors.
• Power our AI Symptom Checker to provide health insights (not medical diagnoses).
• Help you find nearby clinics and hospitals through our Clinic Finder.
• Send appointment reminders, confirmations, and important service updates.
• Ensure the security and integrity of our platform.
• Comply with legal obligations under Kenyan law.`,
    },
    {
        title: '4. Data Sharing & Disclosure',
        content: `We may share your information with:

• **Healthcare Providers** — Doctors you book appointments with can access relevant health information you provide.
• **Service Providers** — Trusted third-party services (e.g., Supabase for data storage, Jitsi for video calls) that help us operate our platform.
• **Legal Requirements** — When required by Kenyan law, court order, or government regulation.

**We never sell your personal data or health information to advertisers, data brokers, or any third parties for commercial purposes.**`,
    },
    {
        title: '5. Data Security',
        content: `We implement robust security measures to protect your data:

• End-to-end encryption for data in transit and at rest.
• Secure authentication powered by Supabase with row-level security policies.
• Access controls ensuring only authorised personnel and your chosen healthcare providers can access your data.
• Regular security audits and vulnerability assessments.`,
    },
    {
        title: '6. Your Rights Under the Kenya Data Protection Act',
        content: `As a data subject under the Kenya Data Protection Act, 2019, you have the right to:

• **Access** — Request a copy of the personal data we hold about you.
• **Rectification** — Request correction of inaccurate or incomplete data.
• **Erasure** — Request deletion of your personal data, subject to legal retention requirements.
• **Data Portability** — Receive your data in a structured, commonly used format.
• **Withdraw Consent** — Withdraw your consent to data processing at any time.
• **Object** — Object to processing of your personal data for specific purposes.

To exercise any of these rights, contact us at support@instamed.co.ke.`,
    },
    {
        title: "7. Children's Privacy",
        content:
            'InstaMed is not directed at individuals under the age of 18 without the involvement of a parent or legal guardian. We do not knowingly collect personal data from minors without parental consent. If you believe we have collected data from a minor, please contact us immediately.',
    },
    {
        title: '8. Data Retention',
        content:
            'We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by Kenyan law. Medical records may be retained for the period required by the Kenya Health Act and related regulations. You may request deletion of your account and associated data at any time.',
    },
    {
        title: '9. Changes to This Policy',
        content:
            'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of the platform after changes constitutes acceptance of the revised policy.',
    },
    {
        title: '10. Contact Us',
        content: `If you have any questions about this Privacy Policy or our data practices, please contact us:

• **Email:** support@instamed.co.ke
• **Office of the Data Protection Commissioner (Kenya):** https://www.odpc.go.ke`,
    },
];

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8 max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" />
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground">Last updated: September 2, 2026</p>
                </motion.div>

                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                        >
                            <Card className="border-none shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{section.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line prose prose-sm max-w-none">
                                        {section.content.split('**').map((part, i) =>
                                            i % 2 === 1 ? (
                                                <strong key={i} className="text-foreground font-semibold">
                                                    {part}
                                                </strong>
                                            ) : (
                                                <span key={i}>{part}</span>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
