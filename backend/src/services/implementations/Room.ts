import { PrismaClient, MemberRole, type User, type Room, type Member  } from "@prisma/client";
import type { IRoomsService } from "../interfaces/Room";
import type { IdOrUsernameQuery } from "../../utils/types/idOrUsernnameQuery";
import { Optional } from "../../utils/Optional";




export class RoomsService implements IRoomsService {
  private client = new PrismaClient();

  constructor() {}

  async getMemberByUsernameAndRoom(username: string, roomName: string): Promise<Member | null> {
    const room = await this.client.room.findFirst({
        where: { name: roomName },
        include: {
            members: {
                where: { user: { name : username } },
                include: { user: true }
            }
        }
    });

    if (!room || room.members.length === 0) return null;

    return room.members[0]
    }

  async getUserRooms(userd: string): Promise<Room[]> {
    return (await this.client.user.findUnique({
      where: {
          id: userd
      },
      include: {
        rooms: true
      }
      }))?.rooms
  }

  async createRoom(name: string, creatorId: string): Promise<string> {
    console.log(name, creatorId)
    const creator = await this.client.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new Error("Creator not found.");
    }

    const room = await this.client.room.create({
      data: {
        name,
        creatorId,
        members: {
          create: {
            userId: creatorId,
            name: creator.name,
            memberRole: MemberRole.Guardian,
          },
        },
      },
    });

    return room.id;
  }

  async addUserToRoom(
    query: IdOrUsernameQuery<string>,
    role: MemberRole,
    roomId: string
  ): Promise<void> {
    const user = await this.client.user.findUnique({
      where: "id" in query ? { id: query.id.ifNotNone(v => v) } : { name: query },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const room = await this.client.room.findUnique({ where: { id: roomId } });

    if (!room) {
      throw new Error("Room not found.");
    }

    await this.client.member.create({
      data: {
        userId: user.id,
        name: user.name,
        roomId: room.id,
        memberRole: role,
      },
    });
  }


  async getMembers(roomId:string): Promise<User[]> {
    const guardians = await this.client.member.findMany({
      where: { roomId },
      include: { user: true },
    }); //! note this returns all members additional logic may be needed

    return guardians.map((guardian) => ({
      id: guardian.user.id,
      name: guardian.user.name,
    }));
  }
}
