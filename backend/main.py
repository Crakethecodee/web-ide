from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import files, process, database, terminal

app = FastAPI(title="Web IDE API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files.router, prefix="/api/files", tags=["files"])
app.include_router(process.router, prefix="/api/process", tags=["process"])
app.include_router(database.router, prefix="/api/database", tags=["database"])
app.include_router(terminal.router, prefix="/ws", tags=["terminal"])

@app.get("/")
def root():
    return {"status": "Web IDE backend running"}