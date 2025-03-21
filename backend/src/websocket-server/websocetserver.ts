import { WebSocketServer, WebSocket } from "ws";
import { PrismaClient } from "@prisma/client";
import { addMemberEntry, deleteMemberEntry } from "../services/implementations/CheckGuarded";

interface ExtendedWebSocket extends WebSocket {
  member_id?: string;
  room_id?: string;
}

const prisma = new PrismaClient();
const wss = new WebSocketServer({ host: "0.0.0.0",port: 8080 });

console.log("✅ WebSocket server running on ws://localhost:8080");

wss.on("connection", async (ws: ExtendedWebSocket) => {
  console.log("🔗 Client connected");

  ws.on("message", async (message) => {
    try {
      console.log("📩 Received:", message.toString());

      const parsed = JSON.parse(message.toString()) as {
        type: string;
        payload: {
          time?: Date;
          data?: { [key: string]: number };
          member_id: string;
          room_id: string;
        };
      };

      if (!parsed.payload.member_id) {
        console.error("❌ Error: No member_id provided in the message");
        ws.send(JSON.stringify({ error: "Missing member_id" }));
        return;
      }

      switch (parsed.type) {
        case "newData":
          await handleNotification(ws, parsed.type, parsed.payload);
          break;

        case "notify":
          await handleNotification(ws, parsed.type, parsed.payload);
          break;

        case "authenticate":
          await handleAuthentication(ws, parsed.type, parsed.payload);
          break;

        default:
          console.error("❌ Unknown message type:", parsed.type);
          ws.send(JSON.stringify({ error: "Unknown message type" }));
      }
    } catch (error) {
      console.error("🚨 Error processing message:", error);
      ws.send(JSON.stringify({ error: "Error processing message" }));
    }
  });

  ws.on("close", () => {
    console.log(`❌ Client disconnected: ${ws.member_id || "Unknown"}`);
  });
});

/**
 * Handles authentication by registering the client and adding them to Redis if they are "Guarded".
 */

async function handleGetData(ws: ExtendedWebSocket, type : string , payload: { member_id: string , room_id: string , data?: { [key: string]: number } }) {
  try {
    console.log(`🔔 Getting data from member_id: ${payload.member_id}`);

    const member = await prisma.member.findUnique({
      where: { id: payload.member_id },
      select: { memberRole: true },
    });

    if (!member) {
      console.log("❌ Member not found in database.");
      ws.send("Member not found.");
      return;
    }
    const data = {
      type: type,
      payload: {
        member_id: payload.member_id,
        room_id: ws.room_id,
        data: payload.data,
      },
    }
    //console.log(`✅ Client authenticated with member_id: ${ws.member_id}, role: ${member.memberRole}`);

    if (member.memberRole === "Guarded") {
      await addMemberEntry(payload.member_id, Date.now());
      ws.send(JSON.stringify(data))
    }
  } catch (error) {
    console.error("🚨 Error during authentication:", error);
    ws.send("Error during authentication.");
  }
}

async function handleAuthentication(ws: ExtendedWebSocket, type : string , payload: { member_id: string; room_id: string}) {
  try {
    ws.member_id = payload.member_id;
    ws.room_id = payload.room_id;

    const member = await prisma.member.findUnique({
      where: { id: payload.member_id },
      select: { memberRole: true },
    });

    if (!member) {
      console.log("❌ Member not found in database.");
      ws.send("Member not found.");
      return;
    }

    console.log(`✅ Client authenticated with member_id: ${ws.member_id}, role: ${member.memberRole}`);

    if (member.memberRole === "Guarded") {
      await addMemberEntry(payload.member_id, Date.now());
    }

    ws.send(JSON.stringify(payload))

  } catch (error) {
    console.error("🚨 Error during authentication:", error);
    ws.send("Error during authentication.");
  }
}

/**
 * Handles notifications by sending messages to the target role group.
 */
async function handleNotification(ws: ExtendedWebSocket, type : string , payload: { member_id: string; data?: { [key: string]: number } }) {
  try {
    console.log(`🔔 Notifying from member_id: ${payload.member_id}`);

    const sender = await prisma.member.findUnique({
      where: { id: payload.member_id },
      select: { memberRole: true },
    });

    if (!sender) {
      console.log("❌ Member not found in database.");
      ws.send("Member not found.");
      return;
    }

    const senderRole = sender.memberRole;
    const targetRole = senderRole === "Guarded" ? "Guardian" : senderRole === "Guardian" ? "Guarded" : null;

    if (!targetRole) {
      console.log("⚠️ Unknown role, no notifications sent.");
      return;
    }

    console.log(`📢 Notifying all '${targetRole}' members...`);

    // Get all members with the target role
    const targetMembers = await prisma.member.findMany({
      where: { memberRole: targetRole },
      select: { id: true },
    });
    const data = {
      type: type,
      payload: {
        member_id: payload.member_id,
        room_id: ws.room_id,
        data: payload.data,
      },
    }
    const targetIds = new Set(targetMembers.map((member) => member.id));

    for (const client of wss.clients) {
      const clientWs = client as ExtendedWebSocket;
      if (clientWs.readyState === WebSocket.OPEN && clientWs.member_id && targetIds.has(clientWs.member_id)) {
        clientWs.send(JSON.stringify(data));
        console.log(`📤 Notification sent to ${clientWs.member_id}`);

        // ✅ **Add Guarded Members to Redis when notified**
        const notifiedMember = await prisma.member.findUnique({
          where: { id: clientWs.member_id },
          select: { memberRole: true },
        });

        if (notifiedMember?.memberRole === "Guarded") {
          await addMemberEntry(clientWs.member_id);
          console.log(`✅ ${clientWs.member_id} added to Redis (active).`);
        }
      }
    }
  } catch (error) {
    console.error("🚨 Error processing notification:", error);
    ws.send("Error processing notification.");
  }
}
