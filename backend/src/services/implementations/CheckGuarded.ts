import { NotificationService } from "./NotifiactionService";
import { WebSocket } from "ws";
import Redis from "ioredis";

const redis = new Redis("redis://209.38.192.145:6379");
const notificationService = new NotificationService();

// Create a single WebSocket instance and reuse it
const ws = new WebSocket("ws://localhost:8080");

// Ensure WebSocket is open before sending messages
function sendMessage(message: object) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket is not open. Message not sent.");
    }
}

// Handle WebSocket connection open
ws.on("open", () => {
    console.log("✅ Connected to WebSocket server");
});

// Handle WebSocket errors
ws.on("error", (error) => {
    console.error("WebSocket error:", error);
});

// Handle WebSocket disconnection
ws.on("close", () => {
    console.log("❌ WebSocket disconnected. Attempting to reconnect...");

    // Reconnect logic
    setTimeout(() => {
        reconnectWebSocket();
    }, 5000);
});

function reconnectWebSocket() {
    ws.removeAllListeners(); // Remove old listeners
    const newWs = new WebSocket("ws://localhost:8080");

    newWs.on("open", () => {
        console.log("✅ Reconnected to WebSocket server");
    });

    newWs.on("error", (error) => {
        console.error("WebSocket error:", error);
    });

    newWs.on("close", () => {
        console.log("❌ WebSocket disconnected. Attempting to reconnect...");
        setTimeout(reconnectWebSocket, 5000);
    });
}

// Redis Error Handling
redis.on("error", (error) => {
    console.error("Redis error:", error);
});

// Function to add a member entry to Redis with a timestamp
async function addMemberEntry(memberId: string, date: number | null = null): Promise<void> {
    try {
        if (!date) date = Date.now();  // Use current timestamp if no date provided
        await redis.set(`member:${memberId}`, date.toString());  // Store timestamp as a string
        console.log(`✅ Entry added: ${memberId} -> ${date}`);
    } catch (error) {
        console.error(`❌ Error adding entry for ${memberId}:`, error);
    }
}

// Function to delete a member entry from Redis
async function deleteMemberEntry(memberId: string): Promise<void> {
    try {
        await redis.del(`member:${memberId}`);
        console.log(`✅ Entry deleted: ${memberId}`);
    } catch (error) {
        console.error(`❌ Error deleting entry for ${memberId}:`, error);
    }
}

// Function to retrieve all active members from Redis
async function getAllEntries(): Promise<{ memberId: string; lastSeen: number }[]> {
    try {
        const array: { memberId: string; lastSeen: number }[] = [];
        const keys = await redis.keys("member:*");

        for (const key of keys) {
            const value = await redis.get(key);
            if (value) {
                array.push({ memberId: key.replace("member:", ""), lastSeen: Number(value) });  // Convert value to number
            }
        }

        return array;
    } catch (error) {
        console.error("❌ Error retrieving entries:", error);
        return [];
    }
}

// Function to check inactive members
async function checkInactiveMembers() {
    try {
        const entries = await getAllEntries();
        const now = Date.now();

        for (const entry of entries) {
            const lastSeenTime = entry.lastSeen;  // lastSeen is now a timestamp (number)
            if (lastSeenTime < now - 10000) {  // 10 seconds for inactivity, adjust as necessary
                console.log(`⚠️ Member ${entry.memberId} has not been active for a while.`);

                // Send authentication message once
                sendMessage({
                    type: "authenticate",
                    payload: {
                        member_id: entry.memberId,  // Use actual member ID
                        room_id: "feda0943-fde0-4020-b5d5-1cdc3a588340",
                    },
                });

                // Send notify message
                sendMessage({
                    type: "notify",
                    payload: {
                        data: { message: `${entry.memberId} has not been active for a while.` },
                        member_id: entry.memberId,  // Use actual member ID
                    },
                });
            }
        }
    } catch (error) {
        console.error("❌ Error in checkInactiveMembers function:", error);
    }

    setTimeout(checkInactiveMembers, 5000); // Run again after 5 seconds
}

// Start checking inactive members
// checkInactiveMembers();

export { addMemberEntry, deleteMemberEntry, checkInactiveMembers };
