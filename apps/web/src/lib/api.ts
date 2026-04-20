/**
 * API Client for Luminous Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

export interface ChatResponse {
  message: string;
  conversation_id: string;
  model: string;
  provider: string;
}

export interface VoiceChatResponse {
  transcription: {
    text: string;
    engine: string;
  };
  response: {
    text: string;
    model: string;
    provider: string;
  };
  audio?: {
    data: string;
    format: string;
    engine: string;
  };
}

export interface ModelStatus {
  current_model: string;
  available_models: Record<string, boolean>;
  fallback_chain: string[];
  ollama_models: Array<{ name: string; size: number; modified: string }>;
}

class LuminousAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/health/`);
    return response.json();
  }

  // Chat
  async chat(message: string, conversationId?: string, language: "th" | "en" = "th"): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.statusText}`);
    }

    return response.json();
  }

  // TTS
  async textToSpeech(text: string, language: "th" | "en" = "th", gender: "male" | "female" = "female"): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/voice/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        language,
        gender,
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS failed: ${response.statusText}`);
    }

    return response.json();
  }

  // STT
  async speechToText(audioBase64: string, language: "th" | "en" | "auto" = "th"): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/voice/stt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audio: audioBase64,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`STT failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Voice chat (STT + AI + TTS)
  async voiceChat(
    audioBase64: string,
    language: "th" | "en" = "th",
    conversationId?: string,
    voiceGender: "male" | "female" = "female"
  ): Promise<VoiceChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/voice/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audio: audioBase64,
        language,
        conversation_id: conversationId,
        voice_gender: voiceGender,
      }),
    });

    if (!response.ok) {
      throw new Error(`Voice chat failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Model status
  async getModelStatus(): Promise<ModelStatus> {
    const response = await fetch(`${this.baseUrl}/api/models/status`);
    if (!response.ok) {
      throw new Error(`Failed to get model status: ${response.statusText}`);
    }
    return response.json();
  }

  // Set model
  async setModel(model: "cloud_anthropic" | "cloud_openai" | "local_ollama" | "mock"): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/models/set`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set model: ${response.statusText}`);
    }

    return response.json();
  }

  // Get voice engines
  async getVoiceEngines(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/voice/engines`);
    if (!response.ok) {
      throw new Error(`Failed to get voice engines: ${response.statusText}`);
    }
    return response.json();
  }

  // WebSocket connection
  connectWebSocket(onMessage: (data: any) => void, onDisconnect?: () => void): WebSocket {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      if (onDisconnect) onDisconnect();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return ws;
  }

  // Language Learning API
  language = {
    // Translate audio
    async translateAudio(audioBase64: string, sourceLang: "th" | "en" = "en", targetLang: "th" | "en" = "th") {
      const response = await fetch(`${this.baseUrl}/api/language/translate/audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: audioBase64,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
      });

      if (!response.ok) throw new Error(`Audio translation failed: ${response.statusText}`);
      return response.json();
    },

    // Translate text
    async translateText(text: string, sourceLang: "th" | "en" = "en", targetLang: "th" | "en" = "th") {
      const params = new URLSearchParams({
        text,
        source_lang: sourceLang,
        target_lang: targetLang,
      });

      const response = await fetch(`${this.baseUrl}/api/language/translate/text?${params}`);
      if (!response.ok) throw new Error(`Text translation failed: ${response.statusText}`);
      return response.json();
    },

    // Summarize content
    async summarize(content: string, contentType: "audio_transcript" | "text" | "mixed" = "text", detailLevel: "brief" | "detailed" | "comprehensive" = "detailed", language: "th" | "en" = "th") {
      const response = await fetch(`${this.baseUrl}/api/language/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          content_type: contentType,
          detail_level: detailLevel,
          language,
        }),
      });

      if (!response.ok) throw new Error(`Summarization failed: ${response.statusText}`);
      return response.json();
    },

    // Grammar check
    async grammarCheck(text: string, language: "th" | "en" = "th") {
      const response = await fetch(`${this.baseUrl}/api/language/grammar/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          text_type: "english",
          language,
        }),
      });

      if (!response.ok) throw new Error(`Grammar check failed: ${response.statusText}`);
      return response.json();
    },

    // Practice mode
    async practice(mode: "listening" | "speaking" | "reading" | "writing", content?: string, userResponse?: string, difficulty: "beginner" | "intermediate" | "advanced" = "intermediate", language: "th" | "en" = "th") {
      const response = await fetch(`${this.baseUrl}/api/language/practice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          content,
          user_response: userResponse,
          difficulty,
          language,
        }),
      });

      if (!response.ok) throw new Error(`Practice mode failed: ${response.statusText}`);
      return response.json();
    },

    // Voice learning (STT + Process + TTS)
    async voiceLearn(audioBase64: string, mode: "translate" | "summarize" | "practice" = "translate", language: "th" | "en" = "th") {
      const params = new URLSearchParams({
        audio: audioBase64,
        mode,
        language,
      });

      const response = await fetch(`${this.baseUrl}/api/language/voice/learn?${params}`);
      if (!response.ok) throw new Error(`Voice learning failed: ${response.statusText}`);
      return response.json();
    },

    // Get language features
    async getFeatures() {
      const response = await fetch(`${this.baseUrl}/api/language/features`);
      if (!response.ok) throw new Error(`Failed to get features: ${response.statusText}`);
      return response.json();
    },
  };
}

// Export singleton instance
export const api = new LuminousAPI();
