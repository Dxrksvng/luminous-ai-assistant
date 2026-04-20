# Luminous - คู่มือการใช้งาน | User Guide

## วิธีเริ่มใช้งาน | Getting Started

### 1. ติดตั้งและรันระบบ | Installation & Running

**Backend (Python API):**
```bash
cd apps/api
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (Next.js):**
```bash
cd apps/web
npm install
npm run dev
```

เข้าใช้งานได้ที่: http://localhost:3000

---

## ฟีเจอร์หลัก | Main Features

### 🤖 Chat Interface
คุยกับ Luminas ได้ทั้งแบบ:
- **ข้อความ** (Text)
- **เสียง** (Voice input + Voice output)

**วิธีใช้:**
1. พิมพ์ข้อความในช่อง input
2. หรือกดปุ่มไมค์ 🎤 พูด
3. กดปุ่มส่ง หรือกด Enter
4. Luminas จะตอบกลับ (พร้อมเสียงถ้าเปิดใช้)

**Language Support:**
- ไทย (Thai) - พูดไทย ได้
- อังกฤษ (English) - Speak English
- สลับภาษาได้ทันที

---

### 🎤 Voice Translate

หน้าพิเศษสำหรับแปลภาษาด้วยเสียง

**ฟีเจอร์:**
1. **Wake Word Detection** - พูดเรียก Luminas อัตโนมัติ
2. **Auto-Translate Mode** - แปลทันทีเมื่อพูด
3. **Live Transcript** - แสดงข้อความจากเสียงแบบ real-time
4. **Translation History** - ประวัติการแปล

**วิธีใช้:**

**วิธี 1: Wake Word**
- พูดว่า: "Hey Luminas" หรือ "ลูมินัส"
- ระบบจะเข้าสู่โหมด auto-translate อัตโนมัติ
- พูดอะไรก็ได้ → จะแปลให้ทันที

**วิธี 2: Manual Recording**
- กดปุ่มไมค์ 🎤 เริ่มอัดเสียง
- พูดตามต้องการ
- กดปุ่ม Stop เมื่อเสร็จ
- กดปุ่ม Translate

**Hotkeys:**
- `Ctrl+L` - เริ่ม/หยุดการฟัง (toggle listening)
- `Ctrl+Space` - เรียก Luminas ทันที

---

### 📝 Language Learning

**ฟีเจอร์สอนภาษา:**

1. **Translation (แปลภาษา)**
   - แปลข้อความไทย↔อังกฤษ
   - พร้อมคำอ่านแบบภาษาไทย (phonetic)

2. **Grammar Check (ตรวจไวยากรณ์)**
   - ตรวจภาษาอังกฤษ
   - แจ้งข้อผิด + คำแนะนำ
   - ให้คะแนน

3. **Practice Modes (โหมดฝึกฝน)**
   - Listening (ฟัง)
   - Speaking (พูด)
   - Reading (อ่าน)
   - Writing (เขียน)

4. **Summarization (สรุปเนื้อหา)**
   - สรุปข้อความ/เสียง
   - แยกจุดสำคัญ
   - คำศัพท์สำคัญ

---

## 🎯 การใช้งานจริง | Real Usage Scenarios

### Scenario 1: Meeting Language Practice (ฝึกภาษาในที่ประชุม)

**สำหรับคนไทยฝึกอังกฤษ:**
1. เข้าหน้า Voice Translate
2. เลือก Source: Thai → Target: English
3. เปิด Auto-translate mode
4. พูดในที่ประชุม (ภาษาไทย)
5. ดูคำแปลภาษาอังกฤษทันที
6. ฟังคำอ่านจาก Luminas

**สำหรับคนอังกฤษฝึกภาษาไทย:**
1. เลือก Source: English → Target: Thai
2. เปิด Auto-translate mode
3. พูดภาษาอังกฤษ
4. ดูคำแปลไทยทันที

### Scenario 2: Conversation with Luminas (คุยกับลูมินัส)

**วิธีคุยเสียงตอบเสียง:**
1. เข้าหน้า Chat
2. กดปุ่มไมค์ 🎤
3. พูด (ไทยหรืออังกฤษ)
4. Luminas รับฟัง → แปล → ตอบ
5. Luminas จะตอบเป็นเสียง
6. พูดต่อได้เลย

### Scenario 3: Quick Translation (แปลภาษาด่วน)

1. เข้าหน้า Voice Translate
2. กดปุ่มไมค์
3. พูดสิ่งที่อยากแปล
4. กด Translate
5. คัดลอกคำแปล

---

## ⚙️ การตั้งค่า | Settings

### Voice Settings (การตั้งค่าเสียง)
- **TTS Voice** - เลือกเสียง (ชาย/หญิง)
- **STT Engine** - เลือก engine แปลงเสียง → ข้อความ
- **Language** - ภาษาที่ใช้ (ไทย/อังกฤษ)

### AI Model Settings
- **Claude** (Anthropic) - Default, ดีที่สุด
- **OpenAI** (GPT) - อีกทางเลือก
- **Ollama** - Local model, offline ได้

---

## 🔧 Troubleshooting

**ไม่ได้ยินเสียง?**
- ตรวจ Microphone permission
- ลอง browser อื่น (Chrome/Edge แนะนำ)

**Luminas ไม่ตอบ?**
- ตรวจว่า backend รันอยู่หรือเปล่า
- เปิด console ดู error

**เสียงไม่เป็นภาษาที่ต้องการ?**
- เปลี่ยน language setting
- ตรวจ wake word detection

---

## 📞 ติดต่อ | Contact

- Project: Luminous - Personal AI Assistant
- Owner: Personal Use
- Docs Location: `/docs` folder

---

**อัปเดตล่าสุด:** 2026-04-18
**เวอร์ชัน:** 1.0.0
