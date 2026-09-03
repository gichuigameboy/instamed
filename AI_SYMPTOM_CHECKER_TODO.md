# AI Symptom Checker Chatbot Implementation

## Overview
Create an AI-powered chatbot that analyzes symptoms and images to provide possible conditions and first aid guidance.

## Implementation Steps

### Phase 1: Database & Backend Setup
- [ ] 1.1 Create Supabase migration for symptom_analyses table
- [ ] 1.2 Create Supabase Edge Function for AI analysis (server-side OpenAI calls)
- [ ] 1.3 Add environment variables for OpenAI API key

### Phase 2: Core Services & Hooks
- [ ] 2.1 Create AI Service (`src/services/aiService.ts`)
  - Symptom analysis function
  - Image analysis function
  - First aid guidance generation
- [ ] 2.2 Create useSymptomChecker hook (`src/hooks/useSymptomChecker.ts`)

### Phase 3: UI Components
- [ ] 3.1 Create Image Uploader component (`src/components/ImageUploader.tsx`)
- [ ] 3.2 Create Chat Interface component (`src/components/SymptomChat.tsx`)
- [ ] 3.3 Create Analysis Result Card (`src/components/AnalysisResult.tsx`)

### Phase 4: Main Page
- [ ] 4.1 Create AI Symptom Checker page (`src/pages/AISymptomChecker.tsx`)
- [ ] 4.2 Add emergency warning banner
- [ ] 4.3 Add AI disclaimer

### Phase 5: Integration
- [ ] 5.1 Update App.tsx with new route `/ai-symptom-checker`
- [ ] 5.2 Update Navbar.tsx with navigation link
- [ ] 5.3 Update Dashboard quick actions with link to symptom checker

### Phase 6: Testing & Polish
- [ ] 6.1 Test image upload functionality
- [ ] 6.2 Test chat interface
- [ ] 6.3 Test AI analysis flow
- [ ] 6.4 Add loading states and animations
- [ ] 6.5 Mobile responsiveness check

## File Structure

```
instamed-source-code/
├── src/
│   ├── components/
│   │   ├── ImageUploader.tsx
│   │   ├── SymptomChat.tsx
│   │   └── AnalysisResult.tsx
│   ├── hooks/
│   │   └── useSymptomChecker.ts
│   ├── pages/
│   │   └── AISymptomChecker.tsx
│   └── services/
│       └── aiService.ts
└── supabase/
    └── migrations/
        └── (new migration for symptom_analyses)
```

## Dependencies Needed
- OpenAI SDK (for AI analysis)
- Already available: React, Tailwind CSS, Radix UI, Lucide Icons

## API Integration
- OpenAI GPT-4 Vision API for image analysis
- OpenAI GPT-4 for symptom text analysis
- Both calls should go through Supabase Edge Function for security

## Key Features
1. **Symptom Input**: Text area for describing symptoms
2. **Image Upload**: Drag & drop or click to upload images
3. **AI Analysis**: Real-time symptom analysis
4. **Possible Conditions**: List of potential conditions with confidence
5. **First Aid Guidance**: Immediate self-care recommendations
6. **Doctor Referral**: When to seek professional help
7. **Emergency Warnings**: Critical symptoms that need immediate attention
8. **Disclaimer**: AI is not a replacement for professional medical advice

## Color Scheme
- Primary: Medical blue/cyan tones
- Emergency: Red for critical warnings
- Success: Green for positive outcomes
- Warning: Orange/Yellow for cautionary advice

## Status: IN PROGRESS

