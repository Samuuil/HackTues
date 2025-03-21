import type { MemberRole, Room } from "@prisma/client";
import type { User } from "../../models/User";
import type { IdOrUsernameQuery } from "../../utils/types/idOrUsernnameQuery";

export interface IRoomsService {
  createRoom(password: string, creatorId: string): Promise<string>;
  addUserToRoom(query: IdOrUsernameQuery<string>, role: MemberRole, roomId: string): Promise<void>;
  getMembers(roomId: string): Promise<User[]>; // it is not optional since a room has to have atleast one user to exit (the creator )
  getUserRooms(userd: string): Promise<Room[]>
}
