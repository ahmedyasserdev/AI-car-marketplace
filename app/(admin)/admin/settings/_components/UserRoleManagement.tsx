'use client'
import Avvvatars from 'avvvatars-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/useFetch";
import { getUsers, updateUserRole } from "@/lib/actions/settings.actions";
import { Loader2, Search, Shield, Users, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import { UserRole } from '@prisma/client';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type RoleAction = {
    type: 'promote' | 'demote';
    user: User;
}

const UserRoleManagement = () => {
    const router = useRouter();
    const {
        loading: fetchingUsers,
        fn: fetchUsers,
        data: usersData,
        error: usersError,
    } = useFetch(getUsers);
    const {
        loading: updatingRole,
        fn: updateRole,
        data: updateRoleResult,
        error: updateRoleError,
    } = useFetch(updateUserRole);
    
    const [search, setSearch] = useState('');
    const [roleAction, setRoleAction] = useState<RoleAction | null>(null);
    
    const filteredUserData = usersData?.success ? usersData.data.filter((user) => (
        user?.name!.toLowerCase().includes(search.toLowerCase()) ||
        user?.email.toLowerCase().includes(search.toLowerCase())
    )) : [];

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async () => {
        if (!roleAction?.user) return;
        
        try {
            const newRole = roleAction.type === 'promote' ? UserRole.ADMIN : UserRole.USER;
           await updateRole({ userId: roleAction.user.id, role: newRole });
            
          
            
            toast.success(`User ${roleAction.type}d successfully!`);
            setRoleAction(null);
            await fetchUsers(); 
            router.refresh(); 
        } catch (error) {
            toast.error('An error occurred while updating user role');
            console.error('Role update error:', error);
        }
    };

    useEffect(() => {
        if (usersError) {
            toast.error('Failed to fetch users');
        }
    }, [usersError]);

    useEffect(() => {
        if (updateRoleError) {
            toast.error('Failed to update user role');
        }
    }, [updateRoleError]);
    const getDialogConfig = (action: RoleAction) => {
        const configs = {
            promote: {
                title: "Confirm Admin Privileges",
                description: `Are you sure you want to give admin privileges to ${action.user?.name || action.user?.email}? Admin users can manage all aspects of the dealership.`,
                confirmButtonText: "Promote User",
                confirmButtonVariant: "default" as const,
                loadingText: "Promoting..."
            },
            demote: {
                title: "Remove Admin Privileges",
                description: `Are you sure you want to remove admin privileges from ${action.user?.name || action.user?.email}? They will no longer be able to access the admin dashboard.`,
                confirmButtonText: "Demote User",
                confirmButtonVariant: "destructive" as const,
                loadingText: "Demoting..."
            }
        };
        
        return configs[action.type];
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Admin Users</CardTitle>
                    <CardDescription>
                        Manage users with admin privileges.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 relative">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-gray-500" />
                        <Input
                            type='search'
                            placeholder='Search Users...'
                            className="w-full pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>


                    {
                        fetchingUsers ? (
                            <div className="flex-center py-12">
                                <Loader2 className="text-gray-400 size-8 animate-spin" />
                            </div>
                        ) : (
                            usersData?.success && filteredUserData.length ? (
                                <div>
                                    <Table>
                                        <TableCaption>A list of Users.</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                filteredUserData.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <div className="size-8 rounded-full bg-gray-200 flex-center overflow-hidden">
                                                                    {user.imageUrl ? (
                                                                        <img
                                                                            src={user.imageUrl}
                                                                            alt={user.name || "User"}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <Avvvatars style={"character"} value={user.name || "Unkown"} />
                                                                    )}
                                                                </div>
                                                                <span>{user.name || "Unnamed User"}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={
                                                                    user.role === "ADMIN"
                                                                        ? "bg-green-800"
                                                                        : "bg-gray-800"
                                                                }
                                                            >
                                                                {user.role}
                                                            </Badge>
                                                        </TableCell>

                                                        <TableCell className="text-right">
                                                            {user.role === "ADMIN" ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-600"
                                                                    onClick={() => setRoleAction({ type: 'demote', user: {
                                                                        ...user,
                                                                        createdAt: new Date(user.createdAt),
                                                                        updatedAt: new Date(user.updatedAt)
                                                                    }})}
                                                                    disabled={updatingRole as boolean}
                                                                >
                                                                    <UserX className="h-4 w-4 mr-2" />
                                                                    Remove Admin
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setRoleAction({ type: 'promote', user: {
                                                                        ...user,
                                                                        createdAt: new Date(user.createdAt),
                                                                        updatedAt: new Date(user.updatedAt)
                                                                    }})}
                                                                    disabled={updatingRole as boolean}
                                                                >
                                                                    <Shield className="h-4 w-4 mr-2" />
                                                                    Make Admin
                                                                </Button>
                                                            )}
                                                        </TableCell>


                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <Users className="size-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="p-medium-18 text-gray-900 mb-1">
                                        No users found
                                    </h3>
                                    <p className="text-gray-500">
                                        {search
                                            ? "No users match your search criteria"
                                            : "There are no users registered yet"}
                                    </p>
                                </div>

                            )
                        )
                    }

                </CardContent>

            </Card>
            {roleAction && (
                <ConfirmationDialog
                    isOpen={!!roleAction}
                    onOpenChange={(open) => !open && setRoleAction(null)}
                    onConfirm={handleRoleUpdate}
                    {...getDialogConfig(roleAction)}
                    isLoading={updatingRole as boolean}
                />
            )}
        </>
    )
}

export default UserRoleManagement