const ws = new WebSocket("ws://localhost:8081");

ws.onopen = () => {
  console.log("Connected to WebSocket server");

  // Send a "newData" message
  const message = {
    type: "newData",
    payload: {
      time: new Date().toISOString(),
        gps: {
            lat: 4,
            lon: 5
        },
        
      author: "Sensor-1",
    },
  };

  ws.send(JSON.stringify(message));
};

ws.onmessage = (event) => {
  console.log("Received from server:", event.data);
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
};
