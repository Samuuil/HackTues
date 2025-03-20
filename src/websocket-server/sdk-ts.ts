
export type Message<T> = {
  type: string;
  payload: T;
};



export class WebSocketClient<T extends Record<string, Message<unknown>>> {
  private ws: WebSocket | null = null;
  private url: string;
  private on: Record<keyof T, (msg: T[keyof T]) => void>;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // 1 second

  constructor(url: string, on: Record<keyof T, (msg: T[keyof T]) => void>) {
    this.url = url;
    this.on = on;
  }

  start() {
    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached. Giving up.");
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket connected.");
      this.reconnectAttempts = 0; // Reset on successful connection
    };

    this.ws.onmessage = (event) => {
      try {
        console.log(event.data)
        const message = JSON.parse(event.data) as Message<unknown>;
        const handler = this.on[message.type as keyof T];

        if (handler) {
          handler(message as T[keyof T]);
        } else {
          console.warn("No handler for message type:", message.type);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket encountered an error:", error);
    };

    this.ws.onclose = (event) => {
      console.warn("WebSocket closed:", event.reason);
      this.reconnect();
    };
  }

  private reconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    console.warn(`Reconnecting in ${delay / 1000} seconds...`);
    setTimeout(() => this.start(), delay); // Start a new connection attempt
  }

  send<K extends keyof T>(type: K, data: T[K]["payload"]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message, WebSocket is not open.");
      return;
    }
    const message: Message<T[K]["payload"]> = { type, data };
    this.ws.send(JSON.stringify(message));
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
