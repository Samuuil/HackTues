import { Client } from "../../websocket-server/sdk-ts";

const readings = [];

function checkIfPersonFell() {
    if (readings.length < 2) return; // Not enough data to analyze
    
    const latest = readings[readings.length - 1];
    const previous = readings[readings.length - 2];
    
    if (!latest || !previous) return;

    const latestData = latest.payload.data;
    const previousData = previous.payload.data;
    
    // Check sudden drop in BPM
    const bpmDrop = previousData.bpm - latestData.bpm;
    const significantBpmDrop = bpmDrop > 20; // Arbitrary threshold for BPM drop
    
    //Check sudden movement based on GPS distance
    const dx = latestData.gps.x - previousData.gps.x;
    const dy = latestData.gps.y - previousData.gps.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const significantMovement = distance > 5; // Arbitrary threshold for movement
    
    if (significantBpmDrop || significantMovement) {
        console.warn("Possible fall detected for member:", latest.payload.member_id);
    }
}

const clientInstance = new Client({
    onNewData(v) {
        readings.push(v);
        console.log(v)
        checkIfPersonFell();
    },
    onNewNotification(v) {
        
    }
})
clientInstance.setUpClient("gregory", "","AAAAAAAA").then (() => {
    setTimeout(async () => {
        clientInstance.authenticate("d2df47d2-9691-41bb-a622-031e289c986d", "feda0943-fde0-4020-b5d5-1cdc3a588340");
    })});