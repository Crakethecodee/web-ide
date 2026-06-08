import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const termRef = useRef(null);

  useEffect(() => {
    const term = new XTerm({
      theme: { background: "#1e1e1e", foreground: "#d4d4d4" },
      fontSize: 13,
      cursorBlink: true,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termRef.current);

    setTimeout(() => fitAddon.fit(), 100);

    const ws = new WebSocket("ws://localhost:8000/ws/terminal");

    ws.onopen = () => term.write("Connected to terminal\r\n");
    ws.onmessage = (e) => term.write(e.data);
    ws.onclose = () => term.write("\r\nDisconnected\r\n");
    ws.onerror = () => term.write("\r\nConnection error\r\n");

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    return () => {
      ws.close();
      term.dispose();
    };
  }, []);

  return (
    <div
      ref={termRef}
      style={{ height: "100%", padding: "4px", background: "#1e1e1e" }}
    />
  );
}