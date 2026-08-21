import os
from typing import Any, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing. "
        "Create backend/.env and add your Gemini API key."
    )


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


MODEL_NAME = "gemini-2.5-flash"


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="AURORA Intelligence API",
    description="Aurora AI backend powered by Gemini",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5500",
        "http://127.0.0.1:5500",

        "http://localhost:5501",
        "http://127.0.0.1:5501",

        "http://localhost:5502",
        "http://127.0.0.1:5502",

        # Temporary development permission.
        # Tighten this before final production deployment.
        "*"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]
)


# ============================================================
# REQUEST MODELS
# ============================================================

class Message(BaseModel):

    role: str

    content: str


class ChatRequest(BaseModel):

    message: str = Field(
        ...,
        min_length=1,
        max_length=20000
    )

    history: Optional[
        list[Message]
    ] = []


# ============================================================
# AURORA SYSTEM PROMPT
# ============================================================

AURORA_SYSTEM_PROMPT = """
You are AURORA, an advanced personal AI intelligence
interface created for Himanshu.

Your personality:

- intelligent
- precise
- helpful
- direct
- futuristic
- technically strong
- encouraging
- conversational
- honest about limitations

You are part of Himanshu's personal portfolio / intelligence
system.

Himanshu is a student and AI builder interested in:

- Artificial Intelligence
- Machine Learning
- Robotics
- Software Engineering
- AI research
- Deep-tech startups
- futuristic technology
- physics
- mathematics
- programming
- projects and product building
- studying abroad
- career development

When answering Himanshu:

1. Give practical answers.
2. Do not unnecessarily repeat the question.
3. Use structured explanations when useful.
4. For technical problems, provide exact steps.
5. For code problems, provide working code.
6. If something is uncertain, clearly say so.
7. Do not invent facts.
8. Keep answers reasonably concise unless detail is requested.
9. If the user asks in Hinglish/Hindi, respond naturally in
   Hinglish/Hindi.
10. If the user asks for English, respond in English.
11. Remember that you are Aurora, not Gemini, when talking
    to the user.
12. Never expose API keys, environment variables, or secrets.

You are the intelligence layer behind the Aurora interface.
"""


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
async def root():

    return {
        "status": "online",
        "service": "Aurora Intelligence API",
        "ai": "Gemini",
        "model": MODEL_NAME
    }


@app.get("/health")
async def health():

    return {
        "status": "healthy",
        "service": "aurora-backend",
        "ai": "Gemini",
        "model": MODEL_NAME
    }


# ============================================================
# HISTORY BUILDER
# ============================================================

def build_prompt(
    message: str,
    history: list[Message]
) -> str:

    prompt_parts = []

    prompt_parts.append(
        AURORA_SYSTEM_PROMPT.strip()
    )

    prompt_parts.append(
        "\n\n--- CONVERSATION HISTORY ---"
    )

    # Keep only the latest messages
    recent_history = history[-12:]

    for item in recent_history:

        role = item.role.lower().strip()

        content = item.content.strip()

        if not content:
            continue

        if role in ["user", "human"]:
            label = "HIMANSHU"

        elif role in ["assistant", "model", "aurora"]:
            label = "AURORA"

        else:
            label = role.upper()

        prompt_parts.append(
            f"\n{label}: {content}"
        )

    prompt_parts.append(
        "\n\n--- CURRENT USER MESSAGE ---"
    )

    prompt_parts.append(
        f"\nHIMANSHU: {message}"
    )

    prompt_parts.append(
        "\n\nAURORA:"
    )

    return "\n".join(prompt_parts)


# ============================================================
# CHAT ENDPOINT
# ============================================================

@app.post("/chat")
async def chat(request: ChatRequest):

    try:

        user_message = request.message.strip()

        if not user_message:

            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty."
            )


        prompt = build_prompt(
            user_message,
            request.history or []
        )


        response = client.models.generate_content(

            model=MODEL_NAME,

            contents=prompt

        )


        answer = getattr(
            response,
            "text",
            None
        )


        if not answer:

            answer = (
                "Aurora received a response from Gemini, "
                "but no text was returned."
            )


        return {

            "success": True,

            "response": answer,

            "model": MODEL_NAME

        }


    except HTTPException:

        raise


    except Exception as error:

        print(
            "\n========== AURORA AI ERROR =========="
        )

        print(
            repr(error)
        )

        print(
            "======================================\n"
        )


        raise HTTPException(

            status_code=500,

            detail=(
                "Aurora AI request failed. "
                "Check the backend terminal for the "
                "actual error."
            )

        )


# ============================================================
# STARTUP MESSAGE
# ============================================================

@app.on_event("startup")
async def startup_event():

    print("")
    print("=" * 60)
    print("        AURORA INTELLIGENCE BACKEND")
    print("=" * 60)
    print("STATUS : ONLINE")
    print("AI     : GEMINI")
    print(f"MODEL  : {MODEL_NAME}")
    print("API    : http://127.0.0.1:8000")
    print("DOCS   : http://127.0.0.1:8000/docs")
    print("=" * 60)
    print("")