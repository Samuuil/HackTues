import { WebSocketServer } from "ws";
import { DataService } from "../services/implementations/Data";
import { context } from "../context";

const wss = new WebSocketServer({ port: 8080 });
const clientRoles = new Map();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    const parsed = JSON.parse(message.toString()) as {
      type: string;
      payload: {
        time: Date;
        data: { [key: string]: number };
        author: string;
        role?: string;
      };
    };

    switch (parsed.type) {
      case "newData":
        ws.send("NewData received");
        break;

      case "notify":
        if (parsed.payload.author === "Guardian") {
          console.log("Notifying all 'Guarded' clients");

          for (const [client, role] of clientRoles.entries()) {
            if (role === "guarded" && client.readyState === WebSocket.OPEN) {
              client.send(Buffer.from(JSON.stringify(parsed.payload.data)));
              console.log("Notification sent to guarded client:", parsed.payload.data);
            }
          }
        }
        break;

      default:
        console.error("Unknown message type:", parsed.type);
    }
  });

  ws.on("message", (message) => {
    const parsed = JSON.parse(message.toString());

    if (parsed.type === "setRole" && parsed.payload.role) {
      clientRoles.set(ws, parsed.payload.role);
      console.log("Client role set to:", parsed.payload.role);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clientRoles.delete(ws);
  });
});

console.log("WebSocket server running on ws://localhost:8080");
