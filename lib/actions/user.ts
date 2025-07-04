
import { User } from "@prisma/client";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";


export const getUserByClerkId = async(clerkId :string) => {
   return  await db.user.findUnique({
        where: {
          clerkUserId: clerkId
        },
      });
}


export const authenticateUser = async () : Promise<User> => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await getUserByClerkId(userId);
    if (!user) throw new Error("Unauthorized");
  
    return user;
  }
  