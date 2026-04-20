# Luminous - Tech Stack | เทคโนโลยีที่ใช้

## Overview

Luminous ใช้ Modern Tech Stack เพื่อประสิทธิภาพและ Performance สูงสุด

---

## 🐍 Backend (Python)

### Core Framework
- **FastAPI** - Modern, fast web framework
  - Async/await support
  - Automatic API documentation (Swagger/ReDoc)
  - Type hints validation ด้วย Pydantic
  - WebSocket support

### Web Server
- **Uvicorn** - ASGI server
  - Fast performance
  - Hot reload ใน development
  - Production ready

### AI/ML Libraries

#### AI Models
- **Anthropic SDK** - Claude 3.5/4
- **OpenAI SDK** - GPT-4o
- **Ollama** - Local AI models

#### Speech Recognition (STT)
1. **Faster-Whisper** - Optimized Whisper implementation
   - 10x faster than original Whisper
   - Lower memory usage
   - Same accuracy

2. **Whisper** - OpenAI's speech recognition
   - Excellent Thai support
   - Multiple model sizes (tiny, base, small, medium, large)
   - Can run offline

3. **SpeechRecognition** - Google Web Speech API
   - No installation needed
   - Requires internet
   - Good for quick testing

#### Text-to-Speech (TTS)
1. **Edge-TTS** - Microsoft Edge's free TTS
   - Best quality
   - Free to use
   - Thai and English voices
   - Requires internet

2. **Coqui TTS** - Local TTS engine
   - High quality
   - Runs locally
   - Supports custom voice
   - Requires GPU for best performance

3. **pyttsx3** - Python TTS
   - Always works offline
   - Simple, reliable
   - Limited Thai support

### HTTP Client
- **httpx** - Async HTTP client
  - Faster than requests
  - Async support
  - Connection pooling

### Data Validation
- **Pydantic v2** - Data validation
  - Type hints
  - Automatic validation
  - JSON Schema generation

### Logging
- **Python logging** - Standard logging
  - Custom formatting
  - Multiple log levels
  - File & console output

### File Upload
- **python-multipart** - Multipart form data

---

## ⚛️ Frontend (Next.js)

### Framework
- **Next.js 14+** - React framework
  - App Router (new)
  - Server Components
  - Client Components
  - API Routes
  - Image optimization
  - Font optimization

### UI Library
- **React 18+** - UI framework
  - Hooks API
  - Concurrent features
  - Context API

- **TypeScript** - Type safety
  - Full type coverage
  - Better DX
  - Catch errors at compile time

### Styling
- **Tailwind CSS** - Utility-first CSS
  - Fast development
  - Small bundle size
  - Responsive design
  - Dark mode support

### UI Components
- **shadcn/ui** - Beautiful, accessible components
  - Button, Input, Card, Badge, ScrollArea
  - Customizable
  - Radix UI primitives

### Icons
- **Lucide React** - Icon library
  - Consistent style
  - Tree-shakeable
  - 1000+ icons

### Animations
- **Framer Motion** - Animation library
  - Smooth transitions
  - Gesture support
  - Layout animations

### State Management
- **React Hooks** - Built-in state
  - useState, useEffect, useCallback, useRef
  - Context API for global state

### API Client
- **Fetch API** - Browser native
  - No extra dependencies
  - Async/await support

### WebSocket
- **Native WebSocket API** - Real-time communication

---

## 🗄️ Shared Package

### Purpose
- Share types และ utilities ระหว่าง backend และ frontend
- Single source of truth

### Technologies
- **TypeScript** - Shared types
- **npm workspace** - Monorepo management

---

## 🗄️ DevOps & Tooling

### Package Managers
- **npm** - Frontend package manager
- **pip** - Python package manager
- **pnpm** (optional) - Monorepo package manager

### Version Control
- **Git** - Version control
- **GitHub** - Remote repository

### Code Quality
- **TypeScript** - Type safety
- **ESLint** - Linting
- **Prettier** (optional) - Code formatting

### Monorepo
- **pnpm workspace** - Multi-package management
  - apps/web
  - apps/api
  - packages/shared

---

## 🗄️ Development Tools

### IDE
- **VS Code** - Recommended
  - TypeScript support
  - Debugging
  - Extensions

### Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin

### Browser DevTools
- Chrome DevTools
- React DevTools
- Network tab for API debugging

---

## 🗄️ Database (Coming Soon)

### Planned
- **PostgreSQL** - Relational database
- **Redis** - Caching
- **Vector DB** - For RAG (Qdrant/Pinecone)

---

## 🗄️ Infrastructure

### Development
- **Localhost** - Everything runs locally
  - Backend: `localhost:8000`
  - Frontend: `localhost:3000`

### Production (Planned)
- **Frontend:** Vercel
- **Backend:** Render / Railway / Fly.io
- **Database:** Supabase / Neon

---

## 🗄️ API Standards

### REST API
- JSON format
- HTTP status codes
- Error handling
- OpenAPI documentation

### WebSocket
- Real-time communication
- JSON messages
- Auto-reconnect
- Bi-directional

---

## 🗄️ Performance Optimizations

### Frontend
- **Code splitting** - Load only what's needed
- **Lazy loading** - Load on demand
- **Image optimization** - Next.js Image
- **Font optimization** - Next.js Font
- **Tree shaking** - Remove unused code

### Backend
- **Async/await** - Non-blocking I/O
- **Connection pooling** - Reuse connections
- **Caching** - (Coming soon)
- **Model selection** - Choose fastest model

---

## 🗄️ Security

### Authentication (Coming Soon)
- JWT tokens
- OAuth providers
- Session management

### Data Protection
- HTTPS only (production)
- Input validation
- SQL injection prevention
- XSS protection

---

## 🗄️ Testing (Planned)

### Unit Tests
- Jest / Vitest
- React Testing Library

### Integration Tests
- Supertest
- Playwright

---

## 🗄️ Monitoring (Planned)

### Frontend
- Analytics
- Error tracking (Sentry)
- Performance monitoring

### Backend
- Logging
- Metrics
- Health checks

---

## 🗄️ Why This Stack?

### Backend: Python + FastAPI
- ✅ Python เป็นภาษาที่ใช้กันมากใน AI/ML
- ✅ FastAPI สร้าง API ได้เร็วและง่าย
- ✅ Async support
- ✅ Type safety ด้วย Pydantic
- ✅ Auto API documentation

### Frontend: Next.js + React
- ✅ Next.js เป็น framework ยอดนิยม
- ✅ Performance ดีเยี่ยม
- ✅ SEO friendly
- ✅ Easy deployment
- ✅ React ecosystem ใหญ่

### Voice: Whisper + Edge-TTS
- ✅ Whisper รองรับภาษาไทยดีมาก
- ✅ Edge-TTS คุณภาพดี ฟรี
- ✅ Local options สำหรับ offline

### AI: Claude
- ✅ รองรับภาษาไทยดีที่สุด
- ✅ Context ยาว
- ✅ Safety features

---

## 🗄️ Alternatives Considered

### Backend Frameworks
- **Express.js** - Chose FastAPI for AI/ML ecosystem
- **Django** - Chose FastAPI for async support
- **Flask** - Chose FastAPI for modern features

### Frontend Frameworks
- **Vue.js** - Chose Next.js for ecosystem
- **Svelte** - Chose Next.js for maturity
- **Remix** - Chose Next.js for stability

### STT Engines
- **Google Cloud STT** - Chose Whisper for cost
- **AWS Transcribe** - Chose Whisper for privacy
- **Azure Speech** - Chose Whisper for Thai support

### TTS Engines
- **Google Cloud TTS** - Chose Edge-TTS for cost
- **Amazon Polly** - Chose Edge-TTS for simplicity
- **Azure Speech** - Chose Edge-TTS for Thai voices

---

## 🗄️ Future Improvements

### Short Term
- [ ] Better Thai TTS (Coqui custom model)
- [ ] More voice options
- [ ] Faster STT optimizations

### Long Term
- [ ] Custom AI fine-tuning
- [ ] Voice cloning
- [ ] Real-time translation in video calls

---

**อัปเดตล่าสุด:** 2026-04-18
**เวอร์ชัน:** 1.0.0
