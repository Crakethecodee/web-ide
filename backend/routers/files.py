from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os, aiofiles

router = APIRouter()
WORKSPACE = os.path.join(os.path.dirname(__file__), "..", "workspace")
os.makedirs(WORKSPACE, exist_ok=True)

def build_tree(path):
    name = os.path.basename(path)
    if os.path.isfile(path):
        return {"name": name, "type": "file", "path": path}
    children = []
    try:
        for entry in sorted(os.listdir(path)):
            full = os.path.join(path, entry)
            children.append(build_tree(full))
    except PermissionError:
        pass
    return {"name": name, "type": "folder", "path": path, "children": children}

class WriteBody(BaseModel):
    path: str
    content: str

class CreateProject(BaseModel):
    name: str

class CloneRepo(BaseModel):
    url: str
    name: str

@router.get("/tree")
def get_tree():
    return build_tree(WORKSPACE)

@router.get("/read")
async def read_file(path: str):
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    async with aiofiles.open(path, "r", errors="replace") as f:
        content = await f.read()
    return {"content": content}

@router.post("/write")
async def write_file(body: WriteBody):
    async with aiofiles.open(body.path, "w") as f:
        await f.write(body.content)
    return {"status": "saved"}

@router.post("/create-project")
def create_project(body: CreateProject):
    path = os.path.join(WORKSPACE, body.name)
    if os.path.exists(path):
        raise HTTPException(400, "Project already exists")
    os.makedirs(path)
    return {"status": "created", "path": path}

@router.post("/clone")
def clone_repo(body: CloneRepo):
    import git
    path = os.path.join(WORKSPACE, body.name)
    if os.path.exists(path):
        raise HTTPException(400, "Folder already exists")
    git.Repo.clone_from(body.url, path)
    return {"status": "cloned", "path": path}