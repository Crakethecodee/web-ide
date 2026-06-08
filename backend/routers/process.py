from fastapi import APIRouter
from pydantic import BaseModel
import subprocess

router = APIRouter()
running_processes = {}

class RunBody(BaseModel):
    project_path: str
    command: str

@router.post("/run")
def run_process(body: RunBody):
    pid_key = body.project_path
    # clean up finished process
    if pid_key in running_processes:
        proc = running_processes[pid_key]
        if proc.poll() is not None:
            del running_processes[pid_key]
        else:
            return {"status": "already running"}
    proc = subprocess.Popen(
        body.command.split(),
        cwd=body.project_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    running_processes[pid_key] = proc
    return {"status": "started", "pid": proc.pid}

@router.post("/stop")
def stop_process(body: RunBody):
    pid_key = body.project_path
    proc = running_processes.get(pid_key)
    if not proc:
        return {"status": "not running"}
    proc.terminate()
    del running_processes[pid_key]
    return {"status": "stopped"}

@router.get("/logs")
def get_logs(project_path: str, lines: int = 100):
    proc = running_processes.get(project_path)
    if not proc:
        return {"logs": "", "running": False}
    output = []
    for _ in range(lines):
        line = proc.stdout.readline()
        if not line:
            break
        output.append(line)
    # auto cleanup if done
    if proc.poll() is not None:
        del running_processes[project_path]
    return {"logs": "".join(output), "running": proc.poll() is None}