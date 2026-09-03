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
    try {
        const { data, error } = await supabase.functions.invoke('ai-symptom-analysis', {
            body: { symptoms, imageBase64 },
        });

        if (error) throw error;
        if (data) return data as SymptomAnalysisResult;
        return MOCK_RESPONSE;
    } catch {
        // Edge function not deployed or OpenAI key not set — return helpful mock
        return MOCK_RESPONSE;
    }
}
