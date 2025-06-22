
import { db } from "../db";


export const getUserByClerkId = async(clerkId :string) => {
   return  await db.user.findUnique({
        where: {
          clerkUserId: clerkId
        },
      });
}