'use server'

import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId } from "./user";
import { User, UserRole } from "@prisma/client";



export const getAdmin = async () : Promise<{user?:User , message?: string , authorized : boolean}> => {
    const {userId } = await auth();

    if (!userId) throw new Error("Unauthorized")

        const user  = await  getUserByClerkId(userId);

        if (!user || user.role !== UserRole.ADMIN) {
                return {authorized : false , message : "not-admin"}
        }

        return {authorized : true , user }
}