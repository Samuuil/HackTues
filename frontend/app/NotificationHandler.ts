export class WebSocketClient {
  private socket: WebSocket;
  private member_id: string;

  constructor(
    member_id: string,
    onNotification: (data: {
      type: string;
      payload: { time?: Date; data?: { [key: string]: number }; member_id: string; room_id: string };
    }) => void
  ) {
    this.socket = new WebSocket('ws://localhost:8080');
    this.member_id = member_id;

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setTimeout(() => {
        this.socket.send(
          JSON.stringify({
            type: 'authenticate',
            payload: {
              member_id: this.member_id,
              room_id: 'feda0943-fde0-4020-b5d5-1cdc3a588340',
            },
          })
        );
      }, 2000);

      this.socket.onmessage = (event) => {
        try{const data = JSON.parse(event.data);
        console.log('Received:', event.data);
        // You can call the onNotification callback here to pass the data to the parent component or handler
        if (onNotification) {
          onNotification({
            type: data.type,
            payload: {
              time: new Date(), // assuming the time is the current time for now
              data: data.payload.data,
              member_id: data.payload.member_id,
              room_id: data.payload.room_id,
            },
          });
        }
      }catch(e){
        console.log('Error parsing JSON', e);
      };
    };
  }
}}