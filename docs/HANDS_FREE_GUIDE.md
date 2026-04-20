# 🎤 Fully Hands-Free Luminas - Complete Guide

## ✅ สิ่งที่อะไรบแล้ว:

### 1. เปิด Component: True Hands-Free Assistant
- **ไฟล์:** `apps/web/src/components/hands-free-assistant.tsx`
- **หน้าเว็บ:** `/hands-free`

### 2. เปิด Service: Web Search
- **ไฟล์:** `apps/api/src/services/web_search_service.py`
- **API:** `apps/api/src/api/endpoints/search.py`

---

## 🚀 เริ่มใช้งานครบ

### Terminal 1: Backend
```bash
cd /Users/jswvn/Desktop/missj/My-project/Javis\ Typhoon/apps/api
python -m uvicorn src.main:app --reload --port 8000
```

### Terminal 2: Ollama (ถ้าต้องการ local AI)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull Thai-friendly model
ollama pull qwen2.5:7b

# Start Ollama
ollama serve
```

### Terminal 3: Frontend
```bash
cd /Users/jswvn/Desktop/missj/My-project/Javis\ Typhoon/apps/web
npm run dev
```

### Browser
```
http://localhost:3000/hands-free
```

---

## 🎯 วิธีใช้งานเหม่อยู่ประบ

### เปิด browser → แสด popup popup
### ปิด microphone permission → อนุญาติ auto
### พูด wake word "ลูมินัส"
### Popup เด้งขึ้มา → Luminas พร้อมใช้งาน!
### พูดอะไรได้เลย → คุยสนทนาได้
### Luminas ตอบเป็นเสียง → ได้ยินคำตอบ
### พูดต่อไปรับอื่นๆ

---

## ⚠️ ถ้า error

### Microphone ไม่ทำงาน
- เช็ค Browser setting → Site settings → Microphone → Allow
- ลอง Chrome แนะนำ Browser อื่น

### Ollama ไม่รันอยู่
- ทำ `ollama serve` ใน Terminal อื่น
- ตรวจ `curl http://localhost:11434/api/tags`

---

**ทำเสร็จครับ!** ไม่ต้องกดเข้าเทอมินอล → เปิด browser → เรองรับ!
