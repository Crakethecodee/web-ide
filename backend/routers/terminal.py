from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio, subprocess, threading

router = APIRouter()

@router.websocket("/terminal")
async def terminal_ws(websocket: WebSocket):
    await websocket.accept()

    proc = subprocess.Popen(
        ["cmd.exe"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    loop = asyncio.get_event_loop()

    def read_thread():
        for line in iter(proc.stdout.readline, ''):
            asyncio.run_coroutine_threadsafe(
                websocket.send_text(line), loop
            )

    t = threading.Thread(target=read_thread, daemon=True)
    t.start()

    buffer = ""
    try:
        while True:
            data = await websocket.receive_text()
            # handle backspace
            if data == "\x7f" or data == "\x08":
                if buffer:
                    buffer = buffer[:-1]
                    await websocket.send_text("\b \b")
            # handle enter
            elif data in ("\r", "\n", "\r\n"):
                await websocket.send_text("\r\n")
                proc.stdin.write(buffer + "\n")
                proc.stdin.flush()
                buffer = ""
            else:
                buffer += data
                await websocket.send_text(data)  # echo back
    except WebSocketDisconnect:
        proc.terminate()
    except Exception:
        proc.terminate()