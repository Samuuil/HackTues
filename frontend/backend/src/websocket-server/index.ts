import { WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client"; // Import Prisma
interface ExtendedWebSocket extends WebSocket {
  member_id?: string; // Optional, since it will be assigned later
}


const prisma = new PrismaClient(); // Initialize Prisma Client
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  const clientws = ws as ExtendedWebSocket;
  console.log("Client connected");
    ws.on("message", async (message) => {
    console.log("Received:", message.toString());

    const parsed = JSON.parse(message.toString()) as {
      type: string;
      payload: {
        time?: Date;
        data?: { [key: string]: number };
        member_id: string; // Changed to use `member_id`
      };
    };

    switch (parsed.type) {
      case "newData":
        ws.send("NewData received");
        break;

      case "notify":
        try {
          console.log("member_id:", parsed.payload.member_id);
          const member = await prisma.member.findUnique({
            where: { id: parsed.payload.member_id },
            select: { memberRole: true },
          });

          if (!member) {
            console.log("Member not found in database.");
            ws.send("Member not found.");
            return;
          }

          const senderRole = member.memberRole; // Can be "guardian" or "guarded"
          let targetRole = "";

          if (senderRole === "Guarded") {
            targetRole = "Guardian"; // Notify guardians if a guarded member sends a message
          } else if (senderRole === "Guardian") {
            targetRole = "Guarded"; // Notify guarded members if a guardian sends a message
          } else {
            console.log("Unknown role, no notifications sent.");
            return;
          }

          console.log(`Notifying all '${targetRole}' members`);

          // Get all members with the target role
          const targetMembers = await prisma.member.findMany({
            where: { memberRole: targetRole },
            select: { id: true },
          });
          const targetIds = new Set(targetMembers.map((member) => member.id));
          console.log("targetIds:", targetIds);

          // Notify only connected clients that match the target role
          for (const ws of wss.clients) {
            const client = ws as ExtendedWebSocket;
            console.log("client:", client.member_id);
            console.log(client);
            if (client.readyState === WebSocket.OPEN && targetIds.has(client.member_id)) {
              client.send(Buffer.from(JSON.stringify(parsed.payload.data)));
              client.send(client.member_id);
            }
              
          }

          console.log(`Notification sent to all '${targetRole}' members.`);
        } catch (error) {
          console.error("Error checking member role:", error);
          ws.send("Error processing notification.");
        }
        break;


      case "authenticate":
        if (!parsed.payload.member_id) {
          console.error("Error: No member_id provided during registration");
          return;
        }

        // Attach the member_id to the WebSocket client
        // if(!clientws.member_id){
          console.log("Client registered with member_id:", parsed.payload.member_id, "clientws.member_id:", clientws.member_id);
          clientws.member_id = parsed.payload.member_id;
        // }
        console.log(`Client registered with member_id: ${ws.member_id}`);
        break;
        default:
        console.error("Unknown message type:", parsed.type);
    }
  });

  clientws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
