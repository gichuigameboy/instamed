import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { SymptomChat, Message } from '@/components/SymptomChat';
import { ImageUploader } from '@/components/ImageUploader';
import { analyzeSymptoms } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

export default function AISymptomChecker() {
    const { toast } = useToast();
    const [symptoms, setSymptoms] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your AI health assistant. Describe your symptoms and upload a photo if needed, and I'll help you understand possible causes and next steps.",
            type: 'text',
        },
    ]);

    const handleAnalyze = async () => {
        if (!symptoms.trim() && !selectedImage) {
            toast({ title: 'Please provide details', description: 'Describe your symptoms or upload an image.', variant: 'destructive' });
            return;
        }

        const userMessage: Message = {
            role: 'user',
            content: symptoms || 'Analyzing uploaded image...',
            type: 'text',
        };

        setMessages((prev) => [...prev, userMessage]);
        setSymptoms('');
        setIsAnalyzing(true);

        try {
            const result = await analyzeSymptoms(symptoms, selectedImage || undefined);

            const aiMessage: Message = {
                role: 'assistant',
                content: "Based on the information provided, here's an analysis of your symptoms:",
                type: 'analysis',
                data: result,
            };

            setMessages((prev) => [...prev, aiMessage]);
            setSelectedImage(null);
        } catch (error: any) {
            toast({ title: 'Analysis failed', description: 'Could not connect to AI service.', variant: 'destructive' });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="container py-8 max-w-4xl flex-1 flex flex-col lg:flex-row gap-8">
                {/* Left Side: Input area */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                            <Bot className="w-8 h-8 text-primary" />
                            AI Symptom Checker
                        </h1>
                        <p className="text-muted-foreground">
                            Powered by AI to provide instant health insights
                        </p>
                    </motion.div>

                    {/* Emergency Banner */}
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex gap-3 text-sm">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Immediate Care Needed?</p>
                            <p>If you are experiencing severe chest pain, difficulty breathing, or sudden weakness, call emergency services immediately.</p>
                        </div>
                    </div>

                    <div className="space-y-4 bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Describe your symptoms</label>
                            <Textarea
                                placeholder="e.g., I have a persistent cough and mild fever since yesterday..."
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                        </div>

                        <ImageUploader onImageSelect={setSelectedImage} />

                        <Button
                            className="w-full h-12 text-base font-medium"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Analyze Symptoms
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-muted/50 p-4 rounded-xl border border-border flex gap-3 text-[11px] text-muted-foreground leading-relaxed">
                        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-primary/50" />
                        <p>
                            This tool provides information for educational purposes only and is NOT a medical diagnosis. Always consult with a qualified healthcare professional for medical advice, diagnoses, or treatment.
                        </p>
                    </div>
                </div>

                {/* Right Side: Chat Interface */}
                <div className="w-full lg:w-1/2 flex flex-col h-[600px] lg:h-auto border border-border rounded-2xl bg-card overflow-hidden shadow-lg">
                    <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">InstaMed Health AI</p>
                            <p className="text-[10px] text-muted-foreground">Online • Ready to help</p>
                        </div>
                    </div>

                    <SymptomChat messages={messages} isTyping={isAnalyzing} />

                    <div className="p-4 bg-muted/10 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="w-3 h-3" />
                        AI can make mistakes. Verify important info.
                    </div>
                </div>
            </main>
        </div>
    );
}
