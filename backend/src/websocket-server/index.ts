import { WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client"; // Import Prisma

const prisma = new PrismaClient(); // Initialize Prisma Client
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
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
          // Fetch the role of the sender (member_id) from the database
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
            targetRole = "guardian"; // Notify guardians if a guarded member sends a message
          } else if (senderRole === "Guardian") {
            targetRole = "guarded"; // Notify guarded members if a guardian sends a message
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

          // Notify only connected clients that match the target role
          for (const client of wss.clients) {
            if (client.readyState === WebSocket.OPEN && targetIds.has(client.member_id)) {
              client.send(Buffer.from(JSON.stringify(parsed.payload.data)));
            }
          }

          console.log(`Notification sent to all '${targetRole}' members.`);
        } catch (error) {
          console.error("Error checking member role:", error);
          ws.send("Error processing notification.");
        }
        break;


      case "authenticate":

        break;
      default:
        console.error("Unknown message type:", parsed.type);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
