import { WebSocket } from "ws";
import { client } from "..";

type ClientHandlers = {
  onNewData: (v: {type : string, payload : { member_id : string, room_id : string, data : {gps: {x: number,y: number}, bpm: number, accelerometer: {x: number, y: number, z: number}}}}) => void;
  onNewNotification: (v: {type : string, payload : { member_id : string, room_id : string, data : object}}) => void;
};

class WebSocketClient {
  private ws: WebSocket;
  private handlers: ClientHandlers;

  constructor(url: string, handlers: ClientHandlers) {
      this.ws = new WebSocket(url);
      this.handlers = handlers;
      this.setupListeners();
  }

  private setupListeners() {
      this.ws.on("open", () => {
          console.log("Connected to WebSocket server");
      });
this.ws.on("message", (data: string) => {
          const parsed = JSON.parse(data.toString()) as { type: string, payload: { member_id: string, room_id: string, data: object } };
          console.log("Received:", parsed);
          switch (parsed.type) {
              case "newData":
                  this.handlers.onNewData(parsed);
                  break;

              case "notify":
                  this.handlers.onNewNotification(parsed);
                  break;

              default:
                  console.error("❌ Unknown message type:", parsed.type);
          }
      });

      this.ws.on("close", () => console.log("Disconnected"));
  }

  sendMessage(message: object) {
      this.ws.send(JSON.stringify(message));
  }
}
class Client {
  private token: string = "";
  private wsClient: WebSocketClient;
  private member_id: string = "";

  constructor(private handlers: ClientHandlers) {
      this.wsClient = new WebSocketClient("ws://localhost:8080", handlers);
  }

  async setUpClient(username : string, password: string, roomName: string) {
      const data = await client.auth.login.post({ username, password });
      this.token = data.data.token;
      console.log("Authenticated", data);

      const memberInfo = await client.rooms.getMemberByUsernameAndRoomName.post({
        username,
        roomName
      },
         {
          headers: {
            Authorization: `Bearer ${this.token}`,
            bearer: 'Bearer ' + this.token
          }
      })
      console.log(memberInfo);
  }

  authenticate(memberId: string, roomID: string) {

      this.wsClient.sendMessage({
          type: "authenticate",
          payload: { member_id: memberId , room_id : roomID} 
      });
  }
sendNotification(memberId: string, data: object, roomID: string) {
    console.log("Sending notification" , memberId, data, roomID);
      this.wsClient.sendMessage({
          type: "notify",
          payload: { member_id: memberId, room_id : roomID,data : data}
      });
  }
}

const handlers: ClientHandlers = {
  onNewData: (v) => console.log("newData", v.payload.data),
  onNewNotification: (v) => console.log("newNotification", v)
};

// const clientInstance = new Client(handlers);
// const data = { "temperature": 25, "humidity": 50 };
// clientInstance.setUpClient("sami", "", "AAAAAAAA").then(() => {
//   setTimeout(() => clientInstance.authenticate("4e0973cf-8bcb-4fb5-bb16-4026b4ba852f", "feda0943-fde0-4020-b5d5-1cdc3a588340"), 1000);
//   setTimeout(() => clientInstance.sendNotification("4e0973cf-8bcb-4fb5-bb16-4026b4ba852f", data,"feda0943-fde0-4020-b5d5-1cdc3a588340" ), 2000);
// });

export {Client}