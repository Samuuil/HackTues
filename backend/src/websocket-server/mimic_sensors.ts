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
                member_id: "4e0973cf-8bcb-4fb5-bb16-4026b4ba852f",
                room_id: "feda0943-fde0-4020-b5d5-1cdc3a588340"
            }
        }));
    }, 1000);
    
    setInterval(() => {
        ws.send(JSON.stringify({
            type: "newData",
            payload: { 
                data: { bpm: 10, gps: { lon: 10, lat: 20 }, acce : { x: 421, y: 41, z: 4 }, gyro : { x: 421, y: 41, z: 4 } },
                member_id: "4e0973cf-8bcb-4fb5-bb16-4026b4ba852f",
                room_id: "feda0943-fde0-4020-b5d5-1cdc3a588340" 
            }
        }));
    }, 10000);
});

ws.on("close", () => console.log("Disconnected"));
