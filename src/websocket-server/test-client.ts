import { WebSocket } from "ws";

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    console.log("Connected to WebSocket server");

    // Send the role of the client to the server
    ws.send(JSON.stringify({
        type: "setRole", // Tell the server we're setting the role
        payload: {
            role: "guardian" // Assign the client role (e.g., "guarded")
        }
    }));

    // Handle incoming messages from the server
    ws.on("message", (data: string) => {
        console.log("Received:", data.toString());
    });

    // Send a notification after 2 seconds (to test the "notify" functionality)
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "notify",
            payload: {
                author: "Guardian", // Author is "Guardian", so it should be filtered
                data: { temperature: 22, humidity: 50 }
            }
        }));
    }, 2000);
});

ws.on("close", () => console.log("Disconnected"));
