'use server'
import { DealershipInfo, UserRole, WorkingHour } from "@prisma/client";
import { db } from "../db";
import { authenticateUser } from "./user";
import { revalidatePath } from "next/cache";

export const getDealerShipInfo = async () => {
    try {
        await authenticateUser();

        let dealership = db.dealershipInfo.findFirst({
            include: {
                workingHours: {
                    orderBy: {
                        daysOfWeek: "asc"
                    }
                }
            }
        })

        if (!dealership) {
            //@ts-expect-error
            dealership = await db.dealershipInfo.create({
                data: {
                    // Default values will be used from schema
                    workingHours: {
                        create: [
                            {

                                daysOfWeek: "MONDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                daysOfWeek: "TUESDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                daysOfWeek: "WEDNESDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                daysOfWeek: "THURSDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                daysOfWeek: "FRIDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                daysOfWeek: "SATURDAY",
                                openTime: "10:00",
                                closeTime: "16:00",
                                isOpen: true,
                            },
                            {
                                daysOfWeek: "SUNDAY",
                                openTime: "10:00",
                                closeTime: "16:00",
                                isOpen: false,
                            },
                        ],
                    },
                },
                include: {
                    workingHours: {
                        orderBy: {
                            daysOfWeek: "asc",
                        },
                    },
                },
            })
        }


        return {
            success: true,
            ...dealership,
            //@ts-expect-error
            createdAt: dealership.createdAt.toISOString(),
            //@ts-expect-error
            updatedAt: dealership.updatedAt.toISOString(),

        }
    } catch (error: any) {
        throw new Error("Error fetching dealership info:" + error.message);
    }
}

export const saveWorkingHours = async (workingHours: WorkingHour[]) => {
    try {
        const user = await authenticateUser();

        if (user.role !== UserRole.ADMIN) throw new Error("Unauthorized Admin access is required");

        const dealership = await db.dealershipInfo.findFirst();

        if (!dealership) throw new Error("Dealership info not found");

        await db.workingHour.deleteMany({
            where: { dealershipId: dealership.id },
        });

        for (const hour of workingHours) {
            await db.workingHour.create({
                data: {
                    daysOfWeek: hour.daysOfWeek,
                    openTime: hour.openTime,
                    closeTime: hour.closeTime,
                    isOpen: hour.isOpen,
                    dealershipId: dealership.id,
                },
            });
        }
        revalidatePath("/admin/settings");
        revalidatePath("/"); 

        return {
            success: true,
        };
    } catch (error: any) {
        throw new Error("Error saving working hours:" + error.message);
    }
}


export const getUser = async () => {
    try {
        
        const user = await authenticateUser();

        if (user.role !== UserRole.ADMIN) throw new Error("Unauthorized Admin access is required");

        const users = await db.user.findMany({
            orderBy : {
                createdAt :'desc'
            }
        });

        return {
            success: true,
            data: users.map((user) => ({
              ...user,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString(),
            })),
          };

    } catch (error : any) {
        throw new Error("Error fetching users:" + error.message);
    }
}

export const updateUserRole = async ({userId , role} : {userId : string , role : UserRole}) => {
     try {
        const user = await authenticateUser();
        if (user.role !== UserRole.ADMIN) throw new Error("Unauthorized Admin access is required");
    
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { role },
        })
       // Revalidate paths
       revalidatePath("/admin/settings");
    
       return {
         success: true,
       }; 
     } catch (error : any) {
        throw new Error("Error updating user role:" + error.message);
     }
}