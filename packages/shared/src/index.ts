// Shared types for Luminous

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  preferences: UserPreferences;
  createdAt: number;
}

export interface UserPreferences {
  language: 'th' | 'en' | 'both';
  theme: 'dark' | 'light' | 'hologram';
  voiceEnabled: boolean;
  voiceSpeed: number;
  notifications: boolean;
}

export interface RealTimeData {
  type: 'stock' | 'news' | 'weather' | 'status';
  data: unknown;
  timestamp: number;
}

export interface SystemStatus {
  status: 'online' | 'offline' | 'busy';
  activeAgent: string | null;
  memoryUsage: number;
  lastActivity: number;
}

// API Request/Response types
export interface ChatRequest {
  message: string;
  conversationId?: string;
  language?: 'th' | 'en';
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  messageId: string;
  thinking?: string;
}

export interface VoiceRequest {
  audioData: string; // base64 encoded
  language?: 'th' | 'en';
}

export interface VoiceResponse {
  text: string;
  audioData?: string;
}

export interface VisionRequest {
  imageData: string; // base64 encoded
  query?: string;
}

export interface VisionResponse {
  analysis: string;
  detectedObjects?: DetectedObject[];
}

export interface DetectedObject {
  label: string;
  confidence: number;
  bbox?: [number, number, number, number];
}

// WebSocket message types
export type WSMessageType =
  | 'chat'
  | 'voice'
  | 'vision'
  | 'status'
  | 'data-update';

export interface WSMessage {
  type: WSMessageType;
  payload: unknown;
  timestamp: number;
}

export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
}

export const AGENT_CAPABILITIES: AgentCapability[] = [
  { name: 'conversation', description: 'Natural language conversation', enabled: true },
  { name: 'reasoning', description: 'Deep reasoning and analysis', enabled: true },
  { name: 'memory', description: 'Long-term memory and recall', enabled: true },
  { name: 'web-search', description: 'Real-time web search', enabled: true },
  { name: 'vision', description: 'Image and video analysis', enabled: true },
  { name: 'voice', description: 'Speech recognition and synthesis', enabled: true },
  { name: 'finance', description: 'Financial analysis and advice', enabled: false },
  { name: 'career', description: 'Career guidance', enabled: false },
];
