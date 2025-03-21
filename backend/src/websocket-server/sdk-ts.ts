import { client } from "..";

async function getMemberIdFromRoomIdAndUsername(username: string, password: string, roomName: string) {
  
  const r = await client.auth.login.post({
    username: username,
    password: password
  })

  console.log("huhu",r.data)

  const rooms = (await client.rooms({
    userId: r.data.id
  }).get({
    headers: {
      "bearer": "Bearer " + r.data.token,
      "Authorization": "Bearer" + r.data.token
    }
  })).data
  
  if (rooms !== null) {
    let roomId
    rooms.forEach(r => {
      if (r.name === roomName) {
        roomId = r.id
      }
    })

    return await client.rooms.members({ roomId }).get({
      headers: {
      bearer: "Bearer" + r.data.token,
      "Authorization": "Bearer" + r.data.token
    }
  })
  }

}


async function setUpClient() { 
  console.log(await getMemberIdFromRoomIdAndUsername("gg","ff","huhu76"))
}
    
setUpClient()
