# Luminous - คู่มือการติดตั้ง | Setup Guide

## ข้อกำหนดเบื้องต้น | Prerequisites

### ต้องมีก่อน:
- ✅ Python 3.10+
- ✅ Node.js 18+
- ✅ npm 9+
- ✅ Git

### แนะนำ:
- VS Code หรือ IDE อื่น
- Chrome หรือ Edge browser
- Microphone (สำหรับ voice features)

---

## ขั้นตอนการติดตั้ง | Installation Steps

### Step 1: Clone Repository

```bash
cd /path/to/your/projects
git clone <repository-url>
cd "Javis Typhoon"
```

### Step 2: ติดตั้ง Backend

```bash
cd apps/api

# สร้าง virtual environment (แนะนำ)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# ติดตั้ง dependencies
pip install -r requirements.txt
```

**Dependencies หลัก:**
```
fastapi          # Web framework
uvicorn          # ASGI server
openai           # OpenAI API
anthropic         # Claude API
ollama           # Local AI
openai-whisper   # STT
faster-whisper   # Faster STT
edge-tts         # TTS (Python wrapper)
httpx            # HTTP client
pydantic          # Data validation
python-multipart   # File upload
```

### Step 3: ติดตั้ง Frontend

```bash
cd ../web

# ติดตั้ง dependencies
npm install
```

**Dependencies หลัก:**
```
next             # React framework
react            # UI library
typescript        # Type safety
tailwindcss       # Styling
lucide-react      # Icons
framer-motion     # Animations
shadcn/ui         # UI components
```

### Step 4: ตั้งค่า Environment Variables

**Backend (apps/api/.env):**
```env
# AI Models
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# Optional: Ollama
OLLAMA_BASE_URL=http://localhost:11434

# Logging
LOG_LEVEL=INFO
```

**Frontend (apps/web/.env.local):**
```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### Step 5: รันระบบ | Run System

**Terminal 1 - Run Backend:**
```bash
cd apps/api
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Run Frontend:**
```bash
cd apps/web
npm run dev
```

เข้าใช้งานได้ที่: http://localhost:3000

---

## การตั้งค่า AI Models | AI Model Configuration

### Option 1: Claude (Anthropic) - **Recommended**

1. สมัคร: https://console.anthropic.com/
2. Get API Key
3. เพิ่มใน `.env`
4. รันระบบ

**ข้อดี:**
- รองรับภาษาไทยดีมาก
- Context ยาว
- ปลอดภัย

### Option 2: OpenAI (GPT)

1. สมัคร: https://platform.openai.com/
2. Get API Key
3. เพิ่มใน `.env`
4. รันระบบ

### Option 3: Ollama (Local)

1. ติดตั้ง Ollama: https://ollama.ai/
2. Pull model:
   ```bash
   ollama pull llama2
   # หรือ
   ollama pull mistral
   ```
3. Start Ollama server
4. ใช้งาน offline ได้

**ข้อดี:**
- ฟรี
- ไม่ต้องเน็ต
- Data privacy ดี

---

## การตั้งค่า Voice Engines | Voice Engine Configuration

### STT (Speech-to-Text) Options

**1. Faster-Whisper (Recommended)**
```bash
pip install faster-whisper
```

**2. Whisper (Default)**
```bash
pip install openai-whisper
```

### TTS (Text-to-Speech) Options

**1. Edge-TTS (Recommended - Free)**
```bash
pip install edge-tts
```

**2. Coqui TTS (Best Quality)**
```bash
pip install TTS
```

**3. pyttsx3 (Offline, Basic)**
```bash
pip install pyttsx3
```

---

## การทดสอบระบบ | Testing

### Test 1: API Health Check

```bash
curl http://localhost:8000/api/health/
```

ควรได้ response: `{"status": "ok"}`

### Test 2: Voice Recognition

1. เข้า http://localhost:3000
2. กดปุ่มไมค์
3. พูดดู
4. ตรวจว่า transcribe ถูกต้อง

### Test 3: TTS

1. เข้า Chat page
2. พิมพ์ข้อความ
3. กดส่ง
4. ตรวจว่าได้ยินเสียง

### Test 4: Voice Chat

1. เปิดใช้ Voice
2. กดปุ่มไมค์
3. พูด (ไทยหรืออังกฤษ)
4. รอ Luminas ตอบเป็นเสียง

---

## การแก้ปัญหา | Troubleshooting

### Backend ไม่รัน

**Problem:** `ModuleNotFoundError`
```bash
# ติดตั้ง dependencies ใหม่
pip install -r requirements.txt
```

**Problem:** Port 8000 ใช้งานอยู่
```bash
# ใช้ port อื่น
python -m uvicorn src.main:app --port 8001
```

### Frontend ไม่รัน

**Problem:** `npm install failed`
```bash
# Clear cache แล้วลงใหม่
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Voice ไม่ทำงาน

**Problem:** ไม่ได้ยินเสียง
- ตรวจ Microphone permission
- ลอง browser อื่น

**Problem:** Transcription ผิด
- ลอง engine อื่น (Whisper → Faster-Whisper)
- ปรับ volume ให้ชัดเจน

**Problem:** TTS ไม่เป็นภาษาไทย
- เปลี่ยน language settings
- ลอง engine อื่น

### AI ไม่ตอบ

**Problem:** API errors
- ตรวจ API key ถูกต้องไหม
- เช็ค API quota
- เช็ค internet connection

---

## การ Deploy | Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel
```

### Backend (Render, Railway, ฯลฯ)

1. Push code ไป GitHub
2. เชื่อมต่อกับ platform
3. Deploy
4. Set environment variables
5. Update API URL ใน frontend

---

## การอัปเดต | Updating

### Update Dependencies

**Backend:**
```bash
cd apps/api
pip install --upgrade -r requirements.txt
```

**Frontend:**
```bash
cd apps/web
npm update
```

### Pull Latest Code

```bash
git pull origin main
```

---

## Tips & Best Practices

1. **ใช้ Claude model** - รองรับไทยดีที่สุด
2. **Edge-TTS** - คุณภาพดี ฟรี
3. **Faster-Whisper** - เร็วกว่า Whisper
4. **Chrome/Edge** - Voice API ดีกว่า browser อื่น
5. **Good Microphone** - สำคัญสำหรับ STT

---

## ติดต่อ Support | Support

เห็นปัญหา?
- เช็ค `/docs/TROUBLESHOOTING.md` (ถ้ามี)
- ดู error message ใน console
- ตรวจ docs ทั้งหมดใน `/docs` folder

---

**สร้าง:** 2026-04-18
**เวอร์ชัน:** 1.0.0
