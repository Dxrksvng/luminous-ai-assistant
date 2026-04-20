# 🧠 Model Architecture - Luminas AI

## 📊 ระบบสลับโมเดล (Model Switching System)

Luminas ใช้ระบบการสลับโมเดลอัตโนมัติ (Automatic Fallback Chain):

```
1. Claude (Anthropic) → Primary Choice
   ↓
2. OpenAI (GPT-4o) → Fallback
   ↓
3. Ollama (Local AI) → Offline/Local Option
   ↓
4. Web Search → Current Information Only
```

---

## 🎯 โมเดลแต่ละตัว

### 1. Claude (Anthropic) - ✅ Primary Choice
**ไฟล์:** `apps/api/src/services/ai_service.py`

```python
response = await self.anthropic_client.messages.create(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    system=system_prompt,
    messages=[{"role": "user", "content": message}],
)
```

**ใช้เมื่อ:**
- มี API Key ของ Anthropic
- ต้องการคุณภาพคำตอบสูงสุด
- มี internet connection

**ข้อดี:**
- เข้าใจภาษาไทยดีมาก
- ตอบสนองคุณภาพสูง
- Safe & Aligned

---

### 2. OpenAI (GPT-4o) - 🔄 Fallback
**ไฟล์:** `apps/api/src/services/ai_service.py`

```python
response = await self.openai_client.chat.completions.create(
    model="gpt-4o",
    messages=[...],
    max_tokens=1024,
)
```

**ใช้เมื่อ:**
- Claude ไม่ทำงาน
- มี API Key ของ OpenAI
- มี internet connection

---

### 3. Ollama (Local AI) - 🏠 Offline Mode

#### โมเดลที่รองรับ:
**ไฟล์:** `apps/api/src/services/ollama_service.py`

```python
RECOMMENDED_MODELS = {
    "llama3.2": {
        "description": "Multilingual, efficient for Thai",
        "size": "~3GB",
    },
    "qwen2.5:7b": {
        "description": "Best for Chinese/Thai languages",
        "size": "~5GB",
    },
    "typhoon": {
        "description": "Thai native model (if available)",
        "size": "~7GB",
    },
}
```

#### ✨ Qwen2.5:7b - Thai Optimized
**วิธีใช้:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull Qwen2.5 model
ollama pull qwen2.5:7b

# Start Ollama
ollama serve

# Update config to use Qwen
# apps/api/src/.env:
# OLLAMA_MODEL=qwen2.5:7b
```

**ข้อดี:**
- เข้าใจภาษาไทยดีมาก (Chinese-trained)
- ทำงาน offline ได้
- Free forever
- ขนาดกะทัดรัด (~5GB)

**ข้อเสีย:**
- ต้องติดตั้ง Ollama
- ต้องรัน Ollama service ตลอดเวลา
- คุณภาพต่ำกว่า Claude

#### 🌪️ Typhoon - Thai Native Model
Typhoon เป็นโมเดลภาษาไทย native ที่พัฒนาโดยคนไทย

**วิธีใช้:**
```bash
# Pull Typhoon model (if available on Ollama)
ollama pull typhoon

# Or use Typhoon from other providers
# Check: https://github.com/eleutherai/lm-evaluation-harness
```

**ข้อดี:**
- เข้าใจภาษาไทยดีที่สุด
- Context ของคนไทยดี
- สละสลวยแบบไทย

**ข้อเสีย:**
- อาจยังไม่มีบน Ollama
- ต้องหาที่เก็บโมเดลอื่น
- ขนาดใหญ่ (~7GB+)

---

### 4. Web Search - 🔍 Current Information
**ไฟล์:** `apps/api/src/services/web_search_service.py`

```python
# Search DuckDuckGo for current information
search_result = await web_search_service.search_and_read(message)
```

**ใช้เมื่อ:**
- ไม่มี AI API Keys
- ต้องการข้อมูลปัจจุบัน
- AI ไม่รู้เรื่องที่ถาม

**API Options:**
- DuckDuckGo (default) - Free, no API key needed
- Google - จำเป็นต้องมี API Key
- SearXNG - Self-hosted search engine

---

## 🚀 วิธี Setup ครบทุกโมเดล

### Option 1: ใช้ Claude (Recommended for Quality)
```bash
# apps/api/src/.env
ANTHROPIC_API_KEY=sk-ant-...
```

### Option 2: ใช้ OpenAI (Backup)
```bash
# apps/api/src/.env
OPENAI_API_KEY=sk-...
```

### Option 3: ใช้ Ollama + Qwen (Free + Offline)
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Pull Qwen
ollama pull qwen2.5:7b

# apps/api/src/.env
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_BASE_URL=http://localhost:11434
```

### Option 4: Web Search Only (No AI API)
```bash
# apps/api/src/.env
# Leave ANTHROPIC_API_KEY and OPENAI_API_KEY empty

# System will use web search automatically
WEB_SEARCH_API=duckduckgo
```

---

## 📝 สรุป: ใช้อะไรดี?

| สถานการณ์ | โมเดลที่แนะนำ | เหตุผล |
|-----------|--------------|---------|
| มี Budget และต้องการคุณภาพสูงสุด | Claude | คำตอบดีที่สุด |
| เครือข่ายไม่เสถียร | Ollama + Qwen2.5 | ทำงาน offline ได้ |
| ไม่มี Budget | Web Search | Free มากกว่า |
| ต้องการความแม่นยำภาษาไทยสูง | Typhoon | Native Thai model |
| Production Deployment | Claude + Web Search | คุณภาพ + ข้อมูลล่าสุด |

---

## 🔄 วิธีอัพเดทโมเดล

### อัพเดท Ollama Models
```bash
# อัพเดทโมเดลที่ติดตั้งแล้ว
ollama pull qwen2.5:7b

# ดูโมเดลที่ติดตั้งแล้ว
ollama list

# ลบโมเดลเก่า
ollama rm llama3.2
```

### อัพเดท API Models
- Claude: Auto-update (managed by Anthropic)
- OpenAI: Auto-update (managed by OpenAI)

---

## 📌 Note สำคัญ

**Luminas ใช้ระบบ Fallback อัตโนมัติ:**
1. ถ้า Claude ไม่ทำงาน → ใช้ GPT-4o
2. ถ้า GPT-4o ไม่ทำงาน → ใช้ Ollama
3. ถ้า Ollama ไม่มี → ใช้ Web Search
4. ถ้าอะไรไม่มีเลย → แจ้ง Mock response

**ไม่ต้องเลือกโมเดลเอง** - Luminas จะสลับให้อัตโนมัติตามที่มีและทำงานได้!

---

**Last Updated:** 2026-04-18
