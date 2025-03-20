import { WebSocketClient } from "../../websocket-server/sdk-ts";

const wsClient = new WebSocketClient<typeof wsObject>("ws://localhost:8081", {
    
})