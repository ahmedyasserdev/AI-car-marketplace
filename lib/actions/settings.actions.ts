'use server'
import { DayOfWeek, DealershipInfo, UserRole, WorkingHour } from "@prisma/client";
import { db } from "../db";
import { authenticateUser } from "./user";
import { revalidatePath } from "next/cache";

export const getDealerShipInfo = async () => {
    try {
        await authenticateUser();

        let dealership = await db.dealershipInfo.findFirst({
            include: {
              workingHours: {
                orderBy: {
                  dayOfWeek: "asc",
                },
              },
            },
          });
      
          // If no dealership exists, create a default one
          if (!dealership) {
            dealership = await db.dealershipInfo.create({
              data: {
                // Default values will be used from schema
                workingHours: {
                  create: [
                    {
                      dayOfWeek: "MONDAY",
                      openTime: "09:00",
                      closeTime: "18:00",
                      isOpen: true,
                    },
                    {
                      dayOfWeek: "TUESDAY",
                      openTime: "09:00",
                      closeTime: "18:00",
                      isOpen: true,
                    },
                    {
                      dayOfWeek: "WEDNESDAY",
                      openTime: "09:00",
                      closeTime: "18:00",
                      isOpen: true,
                    },
                    {
                      dayOfWeek: "THURSDAY",
                      openTime: "09:00",
                      closeTime: "18:00",
                      isOpen: true,
                    },
                    {
                      dayOfWeek: "FRIDAY",
                      openTime: "09:00",
                      closeTime: "18:00",
                      isOpen: true,
                    },
                    {
                      dayOfWeek: "SATURDAY",
                      openTime: "10:00",
                      closeTime: "16:00",
                      isOpen: true,
                    },
                    {
                      dayOfWeek: "SUNDAY",
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
                    dayOfWeek: "asc",
                  },
                },
              },
            });
          }
      
      
        return {
            success: true,
            data:dealership,
        }
    } catch (error: any) {
        throw new Error("Error fetching dealership info:" + error.message);
    }
}

export const saveWorkingHours = async (workingHours: {
    dayOfWeek: DayOfWeek,
    openTime: string,
    closeTime: string,
    isOpen: boolean
}[]) => {
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
                    dayOfWeek: hour.dayOfWeek,
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
            message: "Updated working hours successfully!"
        };
    } catch (error: any) {
        throw new Error("Error saving working hours:" + error.message);

    }
}


export const getUsers = async () => {
    try {

        const user = await authenticateUser();

        if (user.role !== UserRole.ADMIN) throw new Error("Unauthorized Admin access is required");

        const users = await db.user.findMany({
            orderBy: {
                createdAt: 'desc'
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

    } catch (error: any) {
        throw new Error("Error fetching users:" + error.message);
    }
}

export const updateUserRole = async ({ userId, role }: { userId: string, role: UserRole }) => {
    try {
        const user = await authenticateUser();
        if (user.role !== UserRole.ADMIN) throw new Error("Unauthorized Admin access is required");

         await db.user.update({
            where: { id: userId },
            data: { role },
        })
        // Revalidate paths
        revalidatePath("/admin/settings");

        return {
            success: true,
        };
    } catch (error: any) {
        throw new Error("Error updating user role:" + error.message);
    }
}