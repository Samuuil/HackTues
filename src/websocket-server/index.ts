import { WebSocketServer } from "ws";
import { DataService } from "../services/implementations/Data";
import { context } from "../context";

const wss = new WebSocketServer({ port: 8080 });
const clientRoles = new Map(); // Map to store client roles

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Handle incoming messages
  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    const parsed = JSON.parse(message.toString()) as {
      type: string;
      payload: {
        time: Date;
        data: { [key: string]: number };
        author: string;
        role?: string; // Optional role field in the payload for client role
      };
    };

    switch (parsed.type) {
      case "newData":
        // Handle new data (you can add logic to save the data if needed)
        // context.dataService.addData(parsed.payload.time, parsed.payload.data);
        ws.send("NewData received");
        break;

      case "notify":
        // Check if the author is "Guardian"
        if (parsed.payload.author === "Guardian") {
          console.log("Notifying all 'Guarded' clients");

          // Notify only clients with the "guarded" role
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

    // Echo message back
    //ws.send(`Echo: ${message}`);
  });

  // Set the client role when they send the "setRole" message
  ws.on("message", (message) => {
    const parsed = JSON.parse(message.toString());

    if (parsed.type === "setRole" && parsed.payload.role) {
      // Store the client role in the clientRoles map
      clientRoles.set(ws, parsed.payload.role);
      console.log("Client role set to:", parsed.payload.role);
    }
  });

  // Handle client disconnects and remove them from the roles map
  ws.on("close", () => {
    console.log("Client disconnected");
    clientRoles.delete(ws); // Remove client role when they disconnect
  });
});

console.log("WebSocket server running on ws://localhost:8080");
