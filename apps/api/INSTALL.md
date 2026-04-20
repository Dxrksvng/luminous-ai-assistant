# Luminous API - Installation Guide

## Prerequisites

- Python 3.11 or higher
- (Optional) Ollama for local LLM support

## Basic Installation

```bash
# Install basic dependencies
pip install -r requirements.txt
```

## Voice Features Installation

### For STT (Speech-to-Text)

**Option 1: Whisper (Recommended - Best Thai support)**
```bash
pip install openai-whisper
# Whisper will download models automatically on first use
```

**Option 2: Faster-Whisper (Faster, less memory)**
```bash
pip install faster-whisper
```

**Option 3: Google Web Speech (No installation, requires internet)**
```bash
pip install SpeechRecognition
# Also install pyaudio for microphone support
# On macOS: brew install portaudio && pip install pyaudio
# On Linux: sudo apt-get install python3-pyaudio
# On Windows: pip install pyaudio-win32
```

### For TTS (Text-to-Speech)

**Option 1: Edge-TTS (Recommended - Free, good quality)**
```bash
pip install edge-tts
# No additional setup needed, works immediately
```

**Option 2: Coqui TTS (Local, high quality)**
```bash
pip install TTS
# First run will download models automatically
```

**Option 3: pyttsx3 (Simple, always works)**
```bash
pip install pyttsx3
# Works offline immediately
```

## Ollama Setup (for Local LLM)

### Install Ollama

**macOS:**
```bash
brew install ollama
ollama serve
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
```

**Windows:**
Download from https://ollama.com

### Pull Recommended Models

```bash
# Fast and efficient (4GB RAM)
ollama pull llama3.2:3b

# Balanced (8GB RAM)
ollama pull llama3.2

# High quality (16GB RAM)
ollama pull llama3.1:8b

# Excellent Thai support (8GB RAM)
ollama pull qwen2.5:7b

# Minimal (4GB RAM)
ollama pull phi3.5:3.8b
```

## Configuration

Create a `.env` file in the `apps/api/` directory:

```bash
# Copy from example
cp .env.example .env

# Edit with your API keys
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
```

## Running the API

```bash
cd apps/api

# Development mode with auto-reload
python -m src.main

# Or using uvicorn directly
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

Once running, visit:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health
- Root: http://localhost:8000/

## Testing Voice Features

### TTS (Text to Speech)
```bash
curl -X POST "http://localhost:8000/api/voice/tts" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "สวัสดีครับ ผมคือลูมินัส",
    "language": "th",
    "gender": "female"
  }'
```

### STT (Speech to Text)
```bash
# First, encode audio to base64
AUDIO_BASE64=$(base64 -i your_audio.wav)

curl -X POST "http://localhost:8000/api/voice/stt" \
  -H "Content-Type: application/json" \
  -d "{
    \"audio\": \"$AUDIO_BASE64\",
    \"language\": \"th\"
  }"
```

### Model Status
```bash
curl http://localhost:8000/api/models/status
```

## Troubleshooting

### Ollama not connecting
Make sure Ollama is running:
```bash
ollama serve
# In another terminal:
ollama list
```

### Whisper download issues
Whisper downloads models on first use. If stuck, manually download:
```bash
python -c "import whisper; whisper.load_model('base')"
```

### TTS not working
Check available engines:
```bash
curl http://localhost:8000/api/voice/engines
```

## Recommended Setup for Offline Use

1. Install Faster-Whisper:
   ```bash
   pip install faster-whisper
   ```

2. Install pyttsx3 for TTS:
   ```bash
   pip install pyttsx3
   ```

3. Install Ollama and pull a model:
   ```bash
   ollama pull llama3.2:3b
   ```

4. Set model to local:
   ```bash
   curl -X POST "http://localhost:8000/api/models/set" \
     -H "Content-Type: application/json" \
     -d '{"model": "local_ollama"}'
   ```

Now Luminous works completely offline!
