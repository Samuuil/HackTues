import { WebSocket } from "ws";

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    console.log("Connected to WebSocket server");

    

    ws.on("message", (data: string) => {
        console.log("Received:", data.toString());
    });

    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "authenticate",
            payload: {
                member_id: "a6f57b1d-641a-4a05-a33e-7ae775f27f63"
            }
        }));
    }, 1000);
    
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "notify",
            payload: { 
                data: { is_alive: "dead", something: "no" },
                member_id: "d2df47d2-9691-41bb-a622-031e289c986d"
            }
        }));
    }, 2000);
});

ws.on("close", () => console.log("Disconnected"));
