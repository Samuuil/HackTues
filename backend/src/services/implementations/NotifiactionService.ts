import { WebSocket } from "ws";

const ws = new WebSocket("ws://localhost:8080");

class NotificationService{
    constructor(){}
    async sendNotification(roomId: string, memberID : string, message: string){
        ws.on("open", () => {
            console.log("Connected to WebSocket server");
            
            ws.send(JSON.stringify({
                type: "authenticate",
                payload: {
                    member_id: memberID,
                    room_id: roomId
                }
            }));

            ws.send(JSON.stringify({
                type: "notify",
                payload: { 
                    data: { message: message },
                    member_id: memberID
                }
            }));
        });
        
        ws.on("close", () => console.log("Disconnected"));
        
    }
}

export { NotificationService }