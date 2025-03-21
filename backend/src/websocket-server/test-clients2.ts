import { WebSocket } from "ws";
import { context } from "../context";

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    console.log("Connected to WebSocket server");

    ws.on("message", (data: string) => {
        console.log("Received:", data.toString());
    });

    // Send a notification after 2 seconds (to test the "notify" functionality)
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "authenticate",
            payload: {
                member_id: "4e0973cf-8bcb-4fb5-bb16-4026b4ba852f",
                room_id: "feda0943-fde0-4020-b5d5-1cdc3a588340"
            }
        }));
    }, 2000);

    setInterval(() => {
        // Send data with random bpm value between 60 and 80
        ws.send(JSON.stringify({
            type: "newData",
            payload: {
                member_id: "4e0973cf-8bcb-4fb5-bb16-4026b4ba852f",
                newData: {
                    gps: {
                        long: 9,
                        lat: 9,
                    },
                    bpm: {
                        value: Math.floor(Math.random() * (80 - 60 + 1)) + 60, // Random bpm between 60 and 80
                    },
                },
            }
        }));
    }, 2000);
});

ws.on("close", () => console.log("Disconnected"));
