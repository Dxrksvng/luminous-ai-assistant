"""
Luminous Backend API - FastAPI Application
Personal AI Assistant for Je
"""
import sys
from pathlib import Path

# Add src directory to Python path
src_dir = Path(__file__).parent
sys.path.insert(0, str(src_dir))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocket, WebSocketDisconnect

from core.config import settings
from core.logger import logger
from api.endpoints import chat, health, voice, models, language, search
from services.ai_service import AIService
from services.connection_manager import ConnectionManager
from services.tts_service import tts_service
from services.stt_service import stt_service
from services.model_switcher import initialize_model_switcher
from services.language_service import initialize_language_service

# Initialize services
ai_service = AIService()
connection_manager = ConnectionManager()
model_switcher = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global model_switcher
    logger.info("🚀 Luminous API starting up...")

    # Initialize AI service
    await ai_service.initialize()

    # Initialize voice services
    await tts_service.initialize()
    await stt_service.initialize()

    # Initialize model switcher
    model_switcher = await initialize_model_switcher(ai_service)

    # Initialize language learning service
    await initialize_language_service(ai_service)

    logger.info("✅ All services initialized")

    yield

    logger.info("🛑 Luminous API shutting down...")

# Create FastAPI app
app = FastAPI(
    title="Luminous API",
    description="Personal AI Assistant Backend for Je",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(language.router, prefix="/api/language", tags=["language"])
app.include_router(search.router, prefix="/api/search", tags=["search"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Luminous API",
        "version": "1.0.0",
        "status": "operational",
        "message": "สวัสดีครับ — พร้อมทำงานแล้วครับ",
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time communication"""
    await connection_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            logger.info(f"Received WebSocket message: {data}")

            # Process message
            if data.get("type") == "chat":
                response = await ai_service.chat(
                    message=data.get("message", ""),
                    conversation_id=data.get("conversation_id"),
                )
                await websocket.send_json({
                    "type": "chat_response",
                    "data": response,
                })

    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)
        logger.info("WebSocket client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
