import { WebSocket } from "ws";

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
        console.log("Received:", data.toString());
    });


    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "notify",
            payload: {
                author: "Guardian", 
                data: { temperature: 22, humidity: 50 }
            }
        }));
    }, 2000);
});

ws.on("close", () => console.log("Disconnected"));
