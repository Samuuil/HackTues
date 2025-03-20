import { WebSocketServer, WebSocket } from "ws";
import { context } from "../context";

const wss = new WebSocketServer({ port: 8081 });
const clientRoles = new Map<WebSocket, string>(); // Map to store client roles

export const wsObject = {
    newData: {
        type: "newData",
        payload: {
            gps: {
                lon: 3,
                lat: 3
            },
            gyro: {
                x: 3,
                y: 3,
                z: 3,
            },
            accelero: {
                x: 3,
                y: 4,
                z: 5
            },
            sound: "", //will be file 
        }
    }
}


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
        role?: string; // Optional role field for client role
      };
    };

    switch (parsed.type) {
      case "newData":
        // Broadcast newData to all clients
        console.log("recieved data")
        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ type: "newData", payload: parsed.payload })
            );
          }
        }
        console.log("Broadcasted newData:", parsed.payload);
        break;

      case "notify":
        if (parsed.payload.author === "Guardian") {
          console.log("Notifying all 'Guarded' clients");

          for (const [client, role] of clientRoles.entries()) {
            if (role === "guarded" && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({ type: "notify", payload: parsed.payload.data })
              );
              console.log(
                "Notification sent to guarded client:",
                parsed.payload.data
              );
            }
          }
        }
        break;

      case "setRole":
        if (parsed.payload.role) {
          clientRoles.set(ws, parsed.payload.role);
          console.log("Client role set to:", parsed.payload.role);
        }
        break;

      default:
        console.error("Unknown message type:", parsed.type);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clientRoles.delete(ws); // Remove client role when they disconnect
  });
});

console.log("WebSocket server running on ws://localhost:8081");
