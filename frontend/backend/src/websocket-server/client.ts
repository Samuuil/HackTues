const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("Connected to server");
  ws.send(JSON.stringify({ type: "newData", payload: }));
};

ws.onmessage = (event) => {
  console.log("Received from server:", event.data);
};

ws.onclose = () => {
  console.log("Connection closed");
};

