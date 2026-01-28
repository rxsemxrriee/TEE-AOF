from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
#API to talk to main.tsx
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Allow your React app
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {'message' : "hello world"}