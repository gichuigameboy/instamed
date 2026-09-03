import { motion } from 'framer-motion';
import { Bot, User, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    type?: 'analysis' | 'text';
    data?: any;
}

interface SymptomChatProps {
    messages: Message[];
    isTyping?: boolean;
}

export function SymptomChat({ messages, isTyping }: SymptomChatProps) {
    return (
        <ScrollArea className="flex-1 p-4 h-[400px]">
            <div className="space-y-4">
                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                }`}
                        >
                            {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div
                            className={`max-w-[80%] rounded-2xl p-3 text-sm ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-muted text-foreground rounded-tl-none'
                                }`}
                        >
                            {message.content}

                            {message.type === 'analysis' && message.data && (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <p className="font-bold mb-2">Possible Conditions:</p>
                                        <div className="space-y-2">
                                            {message.data.possibleConditions?.map((condition: any, k: number) => (
                                                <div key={k} className="bg-background/50 p-2 rounded-lg border border-border">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold">{condition.name}</span>
                                                        <Badge variant={condition.confidence === 'High' ? 'default' : 'secondary'}>
                                                            {condition.confidence} Confidence
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{condition.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-bold mb-2 text-green-600 dark:text-green-400">First Aid Guidance:</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            {message.data.firstAidGuidance?.map((step: string, k: number) => (
                                                <li key={k}>{step}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {message.data.emergencyWarning && (
                                        <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-xs">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <p><strong>Emergency:</strong> Serious symptoms detected. Please seek immediate medical attention.</p>
                                        </div>
                                    )}

                                    <p className="text-[10px] italic text-muted-foreground mt-2 border-t pt-2 border-border">
                                        {message.data.disclaimer}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted text-foreground rounded-2xl rounded-tl-none p-3 px-4 flex gap-1">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
                            <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}
