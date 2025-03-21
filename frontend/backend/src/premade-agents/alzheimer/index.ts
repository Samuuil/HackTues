import { context } from "../../context";
import { WebSocketClient } from "../../websocket-server/sdk-ts";
import { wsObject } from "../../websocket-server/server";



type Point = { lat: number; lon: number };

// Define a Circle type
type Circle = { center: Point; radius: number };

// Function to check if a point is inside a circle
function isInsideCircle(circle: Circle, point: Point): boolean {
    const dx = point.lat - circle.center.lat;
    const dy = point.lon - circle.center.lon;
    return dx ** 2 + dy ** 2 <= circle.radius ** 2;
}

// Function that returns a circle object
function getCircle(): Circle {
    return {
        center: { lat: 5, lon: 6 }, // Fixed property names
        radius: 6
    };
}

function checkIfIsOutBounds(coords: Point): boolean {
    const circle = getCircle(); // Get the circle
    return !isInsideCircle(circle, coords); // If not inside, it's out of bounds
}




const wClient = new WebSocketClient<typeof wsObject>("ws://localhost:8081", {
    newData: (v) => {
        if (checkIfIsOutBounds(v.payload.gps)) {
            // send notification if it is to all guardians
        }
    }
})



wClient.start()