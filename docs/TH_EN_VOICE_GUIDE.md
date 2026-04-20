# Luminous - คู่มือ Voice Conversation ไทย-อังกฤษ
# Luminous - Thai-English Voice Conversation Guide

## 🎯 ภาพรวมของระบบ | System Overview

Luminous รองรับ **Voice-to-Voice Conversation** ทั้งภาษาไทยและอังกฤษ:

```
┌─────────────────────────────────────────────────────────┐
│                                                 │
│   User Speaks (ไทย/อังกฤษ)                    │
│          │                                      │
│          ▼                                      │
│   ┌──────────────────┐                          │
│   │   STT Engine    │ ← Whisper/Faster-Whisper   │
│   │  เสียง→ข้อความ │                            │
│   └──────────────────┘                          │
│          │                                      │
│          ▼                                      │
│   ┌──────────────────┐                          │
│   │   AI Chat       │ ← Claude/GPT/Ollama       │
│   │   คุยและตอบ   │                            │
│   └──────────────────┘                          │
│          │                                      │
│          ▼                                      │
│   ┌──────────────────┐                          │
│   │   TTS Engine    │ ← Edge-TTS/Coqui/pyttsx3 │
│   │  ข้อความ→เสียง  │                            │
│   └──────────────────┘                          │
│          │                                      │
│          ▼                                      │
│   User Hears Luminas Speak (เสียง)              │
│                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ สิ่งที่ทำได้แล้ว | What Works Now

### 1. Text-to-Voice (ข้อความ → เสียง)
- ✅ พิมพ์ข้อความ → Luminas ตอบเป็นเสียง
- ✅ รองรับภาษาไทย
- ✅ รองรับภาษาอังกฤษ
- ✅ เลือกเสียงชาย/หญิงได้

**วิธีใช้:**
1. เข้าหน้า Chat
2. ตรวจว่าปุ่มเสียง 🔊 เปิดอยู่
3. พิมพ์ข้อความในช่อง input
4. กดปุ่มส่ง
5. รอ Luminas ตอบ
6. จะได้ยินเสียงอัตโนมัติ

### 2. Voice-to-Text (เสียง → ข้อความ)
- ✅ กดปุ่มไมค์ → พูด → ข้อความปรากฏขึ้น
- ✅ รองรับภาษาไทย
- ✅ รองรับภาษาอังกฤษ
- ✅ Auto-detect language

**วิธีใช้:**
1. กดปุ่มไมค์ 🎤
2. พูดสิ่งที่ต้องการ
3. ปุ่มจะกระพริบ = กำลังอัด
4. กดปุ่มหยุดเมื่อพูดเสร็จ
5. ข้อความจะปรากฏในช่อง input
6. กดส่งหรือพิมพ์ต่อ

### 3. Voice-to-Voice (เสียง → เสียง) ⭐ **ครบสมบูรณ์**
- ✅ พูด → Luminas ตอบเป็นเสียง
- ✅ สนทนาได้เลย เหมือนคุยกับคนจริง
- ✅ รองรับทั้งไทยและอังกฤษ
- ✅ Context memory (จำประวัติคุย)

**วิธีใช้:**
1. เข้าหน้า Chat
2. เปิดใช้เสียง (ปุ่ม 🔊 ต้องเปิด)
3. กดปุ่มไมค์ 🎤
4. พูด (ไทยหรืออังกฤษ)
5. Luminas จะรับฟัง → ประมวล → คิดคำตอบ → พูดคำตอบ
6. คุณจะได้ยิน Luminas ตอบกลับ
7. พูดต่อได้เลย!

---

## 🎤 การใช้งานแบบ Full Voice Conversation

### สำหรับคนไทยฝึกอังกฤษ | For Thai Speakers Learning English

**ทดลองพูดภาษาอังกฤษ:**
1. เข้า Chat หรือ Voice Translate page
2. พูดภาษาอังกฤษ:
   - "Hello Luminas, how are you?"
   - "Can you help me practice English?"
   - "What time is it?"
3. Luminas จะเข้าใจและตอบภาษาอังกฤษ
4. Luminas จะพูดตอบกลับเป็นภาษาอังกฤษ
5. คุณจะได้ยินคำอ่านที่ถูกต้อง

**ทดลองแปลจากไทยเป็นอังกฤษ:**
1. เข้า Voice Translate page
2. เลือก Source: Thai, Target: English
3. เปิด Auto-translate
4. พูดภาษาไทย:
   - "วันนี้อากาศทำงานได้ไหม"
   - "ฉันอยากไปร้านอาหาร"
5. ระบบจะแปลเป็นอังกฤษทันที
6. Luminas จะอ่านคำแปลให้ฟัง

### สำหรับคนอังกฤษฝึกภาษาไทย | For English Speakers Learning Thai

**ทดลองพูดภาษาไทย:**
1. เข้า Chat หรือ Voice Translate page
2. พูดภาษาไทย:
   - "สวัสดีครับ" (Sawasdee krub)
   - "ขอบคุณครับ" (Kob khun krub)
   - "ผมชื่อ..." (Phom chue...)
3. Luminas จะเข้าใจและตอบภาษาไทย
4. Luminas จะพูดตอบกลับเป็นภาษาไทย
5. คุณจะได้ยินการออกเสียงที่ถูกต้อง

**ทดลองแปลจากอังกฤษเป็นไทย:**
1. เข้า Voice Translate page
2. เลือก Source: English, Target: Thai
3. เปิด Auto-translate
4. พูดภาษาอังกฤษ:
   - "Where is the restroom?"
   - "How much does this cost?"
5. ระบบจะแปลเป็นภาษาไทยทันที
6. Luminas จะอ่านคำแปลให้ฟัง

---

## 🎧 Wake Word Detection

### Wake Words ที่ใช้ได้ | Available Wake Words

พูดประโยคเหล่านี้เพื่อเรียก Luminas:

| Wake Word | Thai | English |
|-----------|--------|---------|
| "Hey Luminas" | เฮย์ ลูมินัส | - |
| "ลูมินัส" | ลูมินัส | - |
| "Luminas" | - | Luminas |
| "Hey ลูมินัส" | เฮย์ ลูมินัส | - |

### วิธีใช้ Wake Word
1. ระบบจะฟังอยู่ใน background เสมอ
2. พูด wake word เมื่อต้องการ
3. ระบบจะ detect และ active
4. สามารถพูดต่อได้เลย

### Hotkeys
- `Ctrl+L` - เริ่ม/หยุดการฟัง
- `Ctrl+Space` - เรียก Luminas ทันที (quick activate)

---

## 🌍 Auto-Translate Mode

### คืออะไร? | What is it?

**Auto-translate mode** = พูดแล้วแปลเลย ไม่ต้องกดส่ง

### เปิดอย่างไร?
1. เข้า Voice Translate page
2. กดปุ่ม "Auto-Translate" เพื่อเปิด
3. ปุ่มจะเปลี่ยนเป็นสีเขียว
4. พูดได้เลย → จะแปลอัตโนมัติ

### ปิดอย่างไร?
- กดปุ่ม "Auto-Translate" อีกครั้ง
- หรือกด `Ctrl+L`

---

## 📊 ความสามารถของระบบ | System Capabilities

### Thai Language Support
| Feature | Status | Notes |
|---------|---------|-------|
| STT (เสียง→ข้อความ) | ✅ Yes | Whisper รองรับดีมาก |
| TTS (ข้อความ→เสียง) | ✅ Yes | Edge-TTS Thai voices |
| Translation (แปล) | ✅ Yes | AI translation |
| Grammar Check | ⚠️ Limited | English only |
| Practice Modes | ✅ Yes | All 4 modes |

### English Language Support
| Feature | Status | Notes |
|---------|---------|-------|
| STT | ✅ Yes | Excellent support |
| TTS | ✅ Yes | Multiple voices |
| Translation | ✅ Yes | Bidirectional |
| Grammar Check | ✅ Yes | Full support |
| Practice Modes | ✅ Yes | All 4 modes |

### Cross-Language (ไทย ↔ อังกฤษ)
| Feature | Status | Notes |
|---------|---------|-------|
| Translation | ✅ Yes | AI-powered |
| Voice-to-Voice | ✅ Yes | Full conversation |
| Auto-detect | ✅ Yes | Works well |
| Context-aware | ✅ Yes | Remembers history |

---

## 🚀 การปรับใช้สูงสุด | Maximizing Usage

### Tips สำหรับผลลัพธ์ดีที่สุด:

1. **ใช้ Microphone ดี**
   - ไมค์ภายนใกเหมาะ
   - ลดเสียงรบกวน
   - พูดชัดเจน

2. **พูดช้าๆ ในตอนต้น**
   - ให้ STT เรียนรู้เสียง
   - หลังจากนั้นพูดปกติ

3. **ใช้ประโยคสั้นๆ**
   - ยิ่งสั้นยิ่งตรวจจะดีขึ้น
   - ค่อยๆ เพิ่มความซับซ้อน

4. **เลือก AI model ที่เหมาะสม**
   - Claude 3.5/4 = รองรับไทยดีสุด
   - GPT-4o = ทางเลือกอื่น
   - Ollama = ฟรี แต่ต้อง GPU

5. **ใช้ Voice Translate สำหรับแปลด่วน**
   - Auto-translate mode ใช้งานเร็ว
   - แปลทีละประโยค

---

## 🔧 การแก้ปัญหาเฉพาะ Voice | Voice Troubleshooting

### STT (เสียง→ข้อความ) ไม่ทำงาน

**Problem:** ไม่ transcribe หรือ transcribe ผิด

**Solutions:**
1. ตรวจ Microphone permission
   - Chrome: Address bar → Site settings → Microphone
   - Allow permission

2. ลอง Browser อื่น
   - Chrome/Edge แนะนำ
   - Firefox มีปัญหาบางอย่าง

3. ปรับ Volume
   - ไม่เบาเกินไป
   - ไม่ดังเกินไป

4. พูดชัดเจน
   - ไม่พูดเร็วเกินไป
   - ออกเสียงให้ชัด

### TTS (ข้อความ→เสียง) ไม่ทำงาน

**Problem:** ไม่ได้ยินเสียงหรือเสียงแปลก

**Solutions:**
1. เปิดใช้ Voice
   - กดปุ่ม 🔊 ให้เปิด
   - ถ้าหยุดจะไม่มีเสียง

2. เปลี่ยน Engine
   - Edge-TTS = ดีที่สุด (แต่ต้องเน็ต)
   - pyttsx3 = offline ได้

3. เช็ค Audio settings
   - Volume ระบบไม่ปิด
   - Headphone/speaker ต่ออยู่

### Voice-to-Voice ไม่ทำงาน

**Problem:** พูดแล้วไม่ได้ยินคำตอบ

**Solutions:**
1. Backend ต้องรันอยู่
   ```bash
   cd apps/api
   python -m uvicorn src.main:app --reload
   ```

2. เช็ค API URL
   - `http://localhost:8000` ต้องรันอยู่
   - เช็ค `.env.local` ใน frontend

3. ตรวจ AI model
   - API key ต้องถูกต้อง
   - Model ต้องเปิดใช้งาน

---

## 📚️ ตัวอย่างสนทนา | Conversation Examples

### Example 1: แนะนำภาษาอังกฤษ

**User:** "How do I say 'thank you' in Thai?"
**Luminas:** "In Thai, 'thank you' is 'ขอบคุณครับ' (khob khun krub) for men or 'ขอบคุณค่ะ' (khob khun ka) for women."

### Example 2: สอนภาษาไทย

**User:** "How do I pronounce 'สวัสดี'?"
**Luminas:** "สวัสดี is pronounced 'sa-was-dee'. It means 'hello' or 'good greetings' in Thai."

### Example 3: แปลใน meeting

**User:** "Can you translate 'เราจะประชุมตอนสองโมง'?"
**Luminas:** "We will meet at two o'clock."

### Example 4: Practice conversation

**User:** "Hello, my name is John."
**Luminas:** "สวัสดีครับ คุณชื่อจอห์นใช่ไหม (Sawasdee krub, khun chue John chai mai)?"
**User:** "Yes, that's right."
**Luminas:** "ยินดีที่ได้รู้จัก คุณต้องการฝึกภาษาไทยเรื่องไรครับ (Yin dee tee dai roo jak, khun tong kan feuk phasa Thai ruea rai krub)?"

---

## 🎓 การใช้งานในที่ประชุม | Meeting Usage

### Scenario 1: ประชุมกับลูกค้าอังกฤษ

**ทำอย่างไร:**
1. เปิด Voice Translate ไว้ด้านข้าง
2. เลือก English → Thai
3. เปิด Auto-translate
4. เมื่อลูกค้าอังกฤษพูด → ดูคำแปลทันที
5. พอเข้าใจแล้ว → ตอบภาษาอังกฤษ

**ประโยคที่มีประโยคมีประโยค:**
- "Thank you for your time"
- "Let me check and get back to you"
- "Could you please clarify?"

### Scenario 2: ประชุมกับทีมอังกฤษ

**ทำอย่างไร:**
1. เปิด Voice Translate
2. เปิด Auto-translate
3. ฟังเมื่อใครพูดอังกฤษ
4. ดูคำแปลทันที
5. พิมพ์ข้อความภาษาอังกฤษใน Chat
6. ให้ Luminas ช่วยแก้ไวยากรณ์ ถ้าจำเป็น

---

## 🌟 Advanced Features

### Continuous Conversation Mode
- พูดต่อเนื่องได้
- Luminas จำประวัติคุย
- Context ต่อเนื่องไม่หาย

### Multi-turn Translation
- แปลหลายประโยคต่อกัน
- ปรับตาม conversation flow
- เข้าใจ context และ subtext

### Voice Settings Customization
- เลือกเสียงชาย/หญิง
- เลือกความเร็วเสียง
- เลือกความสูงเสียง

---

## 📞 การติดต่อและขอความช่วย | Support

### เห็นปัญหา?
1. เช็ค `/docs/TROUBLESHOOTING.md`
2. ดู error message ใน console (F12)
3. ตรวจว่า Backend รันอยู่ไหม
4. ลอง restart ทั้ง frontend และ backend

### ติดต่อ Development
- Project repo: `/docs/` folder
- Issue tracker: (Coming soon)
- Email: (Personal use)

---

**สร้างเมื่อ:** 2026-04-18
**เวอร์ชัน:** 1.0.0
**อัปเดต:** รองรับ Voice-to-Voice conversation ทั้งภาษาไทยและอังกฤษเต็มรูปแบบ
