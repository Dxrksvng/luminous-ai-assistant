# Luminous - Project Structure

โครงสร้างโปรเจกต์ Luminous (Personal AI Assistant)

```
Javis Typhoon/
├── apps/
│   ├── api/                    # Python Backend (FastAPI)
│   │   └── src/
│   │       ├── api/
│   │       │   └── endpoints/
│   │       │       ├── voice.py      # TTS/STT endpoints
│   │       │       ├── chat.py       # Chat endpoints
│   │       │       ├── language.py   # Language learning endpoints
│   │       │       ├── models.py     # Model management
│   │       │       └── health.py     # Health check
│   │       ├── services/
│   │       │   ├── ai_service.py      # AI chat service
│   │       │   ├── tts_service.py     # Text-to-Speech (Edge-TTS, Coqui, pyttsx3)
│   │       │   ├── stt_service.py     # Speech-to-Text (Whisper, Faster-Whisper)
│   │       │   ├── language_service.py # Translation, Grammar, Practice modes
│   │       │   ├── model_switcher.py  # AI Model switching
│   │       │   └── connection_manager.py # WebSocket connections
│   │       └── core/
│   │           ├── config.py
│   │           └── logger.py
│   │
│   └── web/                    # Frontend (Next.js)
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx              # Main Dashboard
│       │   │   ├── layout.tsx            # Root layout
│       │   │   └── voice-translate/       # Voice Translate page
│       │   │       └── page.tsx
│       │   ├── components/
│       │   │   ├── ui/                  # Shadcn UI components
│       │   │   ├── layout/               # Header, Sidebar
│       │   │   ├── dashboard/            # Dashboard components
│       │   │   ├── chat-interface.tsx    # Chat UI
│       │   │   └── voice-overlay.tsx     # Voice status overlay
│       │   ├── hooks/
│       │   │   ├── useVoiceRecognition.ts    # STT hook
│       │   │   ├── useTextToSpeech.ts       # TTS hook
│       │   │   ├── useWakeWord.ts          # Wake word detection
│       │   │   └── useAutoTranslate.ts     # Auto-translate mode
│       │   └── lib/
│       │       ├── api.ts                # API client
│       │       └── utils.ts              # Utilities
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/                  # Shared types/utilities
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── docs/                       # Project documentation
│   ├── PROJECT_STRUCTURE.md
│   ├── USAGE_GUIDE.md
│   ├── FEATURES.md
│   ├── SETUP.md
│   ├── TECH_STACK.md
│   └── TH_EN_VOICE_GUIDE.md
│
├── README.md
└── pyproject.toml
```

## Directory Descriptions

### Backend (`apps/api/`)
Python FastAPI backend สำหรับ:
- AI Chat ด้วยหลาย Model (Claude, OpenAI, Ollama)
- Text-to-Speech (TTS) - Edge-TTS, Coqui, pyttsx3
- Speech-to-Text (STT) - Whisper, Faster-Whisper
- Language Learning - Translation, Grammar check, Practice modes
- WebSocket สำหรับ real-time connection

### Frontend (`apps/web/`)
Next.js App Router frontend สำหรับ:
- Dashboard และ Monitoring
- Chat Interface พร้อม voice support
- Voice Translate page
- Wake word detection
- Auto-translate mode

### Shared (`packages/shared/`)
TypeScript types และ utilities ที่ใช้ร่วมกันระหว่าง backend และ frontend

### Docs (`docs/`)
เอกสารประกอบโปรเจกต์

---

**สร้างเมื่อ:** 2026-04-18
**เจ้าของ:** Personal AI Assistant - Luminous
