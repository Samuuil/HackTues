import { WebSocketClient } from "../../websocket-server/sdk-ts";

export const wsObject= {
    newData: {
        type: "newData",
        payload: {
            gps: {
                lon: 3,
                lat: 3
            },
            gyro: {
                x: 3,
                y: 3,
                z: 3,
            },
            accelero: {
                x: 3,
                y: 4,
                z: 5
            },
            sound: "", //will be file 
        }
    }
}




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
        console.log(v)
        checkIfIsOutBounds(v.payload.gps)
    }
}).start()