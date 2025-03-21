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
                member_id: "a6f57b1d-641a-4a05-a33e-7ae775f27f63",
                room_id: "feda0943-fde0-4020-b5d5-1cdc3a588340"
            }
        }));
    }, 1000);
    
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "notify",
            payload: { 
                data: { is_out_of_bouns: "dead", has_fallen: "no" },
                member_id: "a6f57b1d-641a-4a05-a33e-7ae775f27f63"
            }
        }));
    }, 2000);
});

ws.on("close", () => console.log("Disconnected"));
