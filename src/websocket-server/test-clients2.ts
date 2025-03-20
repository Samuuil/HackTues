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
                client_id: "4e0973cf-8bcb-4fb5-bb16-4026b4ba852f"
            }
        }));
    }, 2000);
    
});

ws.on("close", () => console.log("Disconnected"));
