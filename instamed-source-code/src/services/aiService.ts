import { supabase } from '@/integrations/supabase/client';

export interface SymptomAnalysisResult {
    possibleConditions: Array<{
        name: string;
        confidence: 'High' | 'Medium' | 'Low';
        description: string;
    }>;
    firstAidGuidance: string[];
    whenToSeekHelp: string;
    emergencyWarning: boolean;
    disclaimer: string;
}

const MOCK_RESPONSE: SymptomAnalysisResult = {
    possibleConditions: [
        {
            name: 'Analysis Pending',
            confidence: 'Low',
            description:
                'AI analysis requires an OpenAI API key to be configured in Supabase. Please contact your administrator to enable this feature.',
        },
    ],
    firstAidGuidance: [
        'Rest and stay hydrated',
        'Monitor your symptoms',
        'Consult a doctor if symptoms worsen',
    ],
    whenToSeekHelp:
        'If symptoms are severe, persistent, or worsening, please book a consultation with one of our doctors.',
    emergencyWarning: false,
    disclaimer:
        'AI analysis is not a substitute for professional medical advice. Always consult a qualified healthcare provider.',
};

export async function analyzeSymptoms(
    symptoms: string,
    imageBase64?: string
): Promise<SymptomAnalysisResult> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
        return {
            possibleConditions: [
                {
                    name: 'API Key Missing',
                    confidence: 'Low',
                    description: 'Please add VITE_GEMINI_API_KEY to your .env.local file to enable AI analysis.',
                },
            ],
            firstAidGuidance: ['Configure your Gemini API key to proceed.'],
            whenToSeekHelp: 'N/A',
            emergencyWarning: false,
            disclaimer: 'System configuration required.',
        };
    }

    try {
        const parts: any[] = [{ text: symptoms || 'Analyze this image for medical symptoms and potential conditions.' }];
        
        if (imageBase64) {
            const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
            const base64Data = imageBase64.split(',')[1] || imageBase64;
            
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: `You are an AI medical assistant. Analyze the symptoms provided by the user and return a JSON object matching this exact TypeScript interface:
{
    possibleConditions: Array<{ name: string; confidence: 'High' | 'Medium' | 'Low'; description: string; }>;
    firstAidGuidance: string[];
    whenToSeekHelp: string;
    emergencyWarning: boolean;
    disclaimer: string;
}
Ensure the output is strictly valid JSON without markdown blocks.` }]
                },
                contents: [
                    {
                        parts: parts
                    }
                ],
                generationConfig: {
                    responseMimeType: 'application/json'
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;
        return JSON.parse(content) as SymptomAnalysisResult;
    } catch (error: any) {
        console.error('AI Analysis failed:', error);
        return {
            possibleConditions: [
                {
                    name: 'Analysis Failed',
                    confidence: 'Low',
                    description: `Error: ${error.message || 'Network or CORS error. Please check console.'}`,
                },
            ],
            firstAidGuidance: ['Please try again later or check your API key / network connection.'],
            whenToSeekHelp: 'N/A',
            emergencyWarning: false,
            disclaimer: 'System configuration error.',
        };
    }
}
