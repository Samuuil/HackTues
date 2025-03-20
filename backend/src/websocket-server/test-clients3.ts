import { WebSocket } from "ws";
import { context } from "../context";

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    console.log("Connected to WebSocket server");


    ws.send(JSON.stringify({
        type: "setRole", 
        payload: {
            role: "guardian" 
        }
    }));


    ws.on("message", (data: string) => {
        context
        console.log("Received:", data.toString());
    });

    // Send a notification after 2 seconds (to test thse "notify" functionality)
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "authenticate",
            payload: {
                member_id: "c6eea75f-a03f-42e0-ba51-aad488bfc9f0"
            }
        }));
    }, 2000);
    
});

ws.on("close", () => console.log("Disconnected"));
