import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
    {
        title: '1. Acceptance of Terms',
        content:
            'By accessing or using InstaMed, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms constitute a legally binding agreement between you and InstaMed.',
    },
    {
        title: '2. Description of Service',
        content: `InstaMed is a digital healthcare platform operating in Kenya that provides:

• **Appointment Booking** — Schedule consultations with registered healthcare professionals.
• **Video Consultations** — Conduct real-time video calls with doctors via our integrated telehealth system.
• **AI Symptom Checker** — An AI-powered tool that provides general health insights based on symptoms you describe or images you upload.
• **Clinic Finder** — Locate nearby hospitals and clinics across Kenya with directions.
• **Health Records** — Securely store and share medical records with your healthcare providers.`,
    },
    {
        title: '3. User Accounts',
        content: `To use InstaMed, you must:

• Register an account with accurate and truthful information.
• Be at least 18 years old, or have the consent of a parent or legal guardian.
• Maintain the confidentiality of your login credentials.
• Notify us immediately of any unauthorised access to your account.
• Accept responsibility for all activities that occur under your account.

We reserve the right to suspend or terminate accounts that violate these terms.`,
    },
    {
        title: '4. Medical Disclaimer',
        content: `**IMPORTANT — PLEASE READ CAREFULLY:**

• InstaMed is a technology platform that connects patients with healthcare professionals. **We are not a licensed medical provider.**
• The **AI Symptom Checker is NOT a substitute for professional medical advice, diagnosis, or treatment.** It provides general health information for educational purposes only.
• Always seek the advice of a qualified healthcare professional with any questions regarding a medical condition.
• **Never disregard professional medical advice or delay seeking it because of information provided by our AI tools.**
• **In case of a medical emergency, call 999 or 112 immediately, or go to your nearest emergency department.**
• The doctors on our platform are independent healthcare professionals. InstaMed does not employ them and is not responsible for their medical decisions.`,
    },
    {
        title: '5. User Conduct',
        content: `When using InstaMed, you agree not to:

• Provide false or misleading information.
• Impersonate another person or healthcare professional.
• Use the platform for any unlawful purpose.
• Attempt to gain unauthorised access to our systems or other users' data.
• Transmit malicious software or interfere with the platform's operation.
• Share your account credentials with others.
• Use the AI Symptom Checker to replace a professional medical consultation for serious symptoms.`,
    },
    {
        title: '6. Intellectual Property',
        content:
            'All content, features, and functionality of InstaMed — including but not limited to text, graphics, logos, icons, software, and AI models — are the exclusive property of InstaMed and are protected by Kenyan and international intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.',
    },
    {
        title: '7. Fees and Payments',
        content:
            'InstaMed currently offers its services free of charge to patients. We reserve the right to introduce fees for certain services in the future, with reasonable advance notice. Any fee changes will be communicated to you before they take effect.',
    },
    {
        title: '8. Limitation of Liability',
        content: `To the maximum extent permitted by Kenyan law:

• InstaMed is provided on an "as is" and "as available" basis without warranties of any kind.
• We do not guarantee that the platform will be uninterrupted, error-free, or secure at all times.
• We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
• Our total liability for any claim shall not exceed the amount you have paid us in the preceding 12 months (if any).
• We are not responsible for the quality of medical advice provided by healthcare professionals on our platform.`,
    },
    {
        title: '9. Termination',
        content:
            'We may terminate or suspend your account at any time, with or without cause and with or without notice, if we believe you have violated these Terms of Service. You may also delete your account at any time through your profile settings. Upon termination, your right to use the platform ceases immediately, though certain provisions of these terms will survive termination.',
    },
    {
        title: '10. Governing Law & Dispute Resolution',
        content:
            'These Terms of Service shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from or relating to these terms or the use of InstaMed shall be subject to the exclusive jurisdiction of the courts of Kenya. Before resorting to legal proceedings, parties agree to attempt to resolve disputes through good-faith negotiation.',
    },
    {
        title: '11. Contact Us',
        content: `If you have any questions about these Terms of Service, please contact us:

• **Email:** support@instamed.co.ke`,
    },
];

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8 max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-primary" />
                        Terms of Service
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
                                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
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
