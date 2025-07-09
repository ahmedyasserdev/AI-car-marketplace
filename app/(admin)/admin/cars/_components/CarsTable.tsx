'use client'

import { SerializedCarType } from '@/types'
import { Card, CardContent } from "@/components/ui/card"
import { CarIcon, Eye, Loader2, MoreHorizontal, Star, StarOff, Trash2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CarStatus } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useFetch } from '@/hooks/useFetch'
import { deleteCar, updateCar } from '@/lib/actions/cars.actions'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoCarsFound from './NoCarsFound'
import ConfirmationDialog from '@/components/shared/ConfirmationDialog'

type CarsTableProps = {
    cars: SerializedCarType[] | undefined
    loading: boolean | null
    success: boolean | undefined
    search: string
    getCarsFn: () => SerializedCarType[]
}




const CarsTable = ({ search, getCarsFn, cars, loading, success }: CarsTableProps) => {
    const { data: updateResult, fn: updateCarAction, loading: updateCarActionLoading, error: updateError } = useFetch(updateCar);
    const { data: deleteCarResult, fn: deleteCarAction, loading: deleteCarActionLoading, error: deleteError } = useFetch(deleteCar)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [carToDelete, setCarToDelete] = useState<SerializedCarType | null>(null);
    const router = useRouter()
    const getStatusBadge = (status: CarStatus) => {
        switch (status) {
            case CarStatus.AVAILABLE:
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Available
                    </Badge>
                )
            case CarStatus.UNAVAILABLE:
                return (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        Unavailable
                    </Badge>
                )
            case CarStatus.SOLD:
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        Sold
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }
    const carStatusOption = [
        { label: 'Set Available', value: CarStatus.AVAILABLE },
        { label: 'Set Unavailable', value: CarStatus.UNAVAILABLE },
        { label: 'Set Sold', value: CarStatus.SOLD }
    ]

    const handleToggleFeatured = async (car: SerializedCarType) => {
        await updateCarAction({ id: car.id, featured: !car.featured })
        router.push("/admin/cars")
    }
    const handleStatusUpdate = async (car: SerializedCarType) => {
        await updateCarAction({ id: car.id, status: car.status })
        router.push("/admin/cars")
    }

    const handleDeleteCar = async () => {
        if (!carToDelete) return;
        await deleteCarAction(carToDelete.id)
        setDeleteDialogOpen(false)
        setCarToDelete(null)
        toast.success(deleteCarResult?.message)
        router.push("/admin/cars")

    }

    useEffect(() => {
        if (deleteCarResult?.success) {
            toast.success(deleteCarResult.message)
            //@ts-expect-error
            getCarsFn(search)
        }
        if (updateResult?.success) {
            toast.success(updateResult.message)
            //@ts-expect-error
            getCarsFn(search)
        }
    }, [updateResult, search])

    // handle errros
    useEffect(() => {


        if (deleteError) {
            toast.error(deleteCarResult?.error);
        }

        if (updateError) {
            toast.error(updateResult?.error);
        }
    }, [deleteError, updateError]);
    return (
        <div className='space-y-4'>
            <Card>
                <CardContent className="p-0 px-4">
                    {loading && !cars ? (
                        <div className="flex-center py-12">
                            <Loader2 className='size-8 animate-spin text-gray-400' />
                        </div>
                    ) : success && cars?.length ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Make & Model</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Featured</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cars.map((car) => (
                                        <TableRow key={car.id}>
                                            <TableCell>
                                                <div className="size-10 rounded-md overflow-hidden">
                                                    {car.images && car.images.length > 0 ? (
                                                        <Image
                                                            src={car.images[0]}
                                                            alt={`${car.make} ${car.model}`}
                                                            height={40}
                                                            width={40}
                                                            className="size-full object-cover"
                                                            priority
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <CarIcon className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {car.make} {car.model}
                                            </TableCell>
                                            <TableCell>{car.year}</TableCell>
                                            <TableCell>{formatCurrency(car.price)}</TableCell>
                                            <TableCell>{getStatusBadge(car.status)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    disabled={updateCarActionLoading as boolean}
                                                    variant={'ghost'}
                                                    className='size-9 p-0'
                                                    onClick={() => handleToggleFeatured(car)}
                                                >
                                                    {car.featured ? (
                                                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                                    ) : (
                                                        <StarOff className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="p-0 h-8 w-8"
                                                        >
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align='end'>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => router.push(`/cars/${car.id}`)}
                                                        >
                                                            <Eye className="mr-2 size-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {carStatusOption.map((status) => (
                                                            <DropdownMenuItem
                                                            disabled={car.status === status.value}
                                                                key={status.value}
                                                                onClick={() => handleStatusUpdate({ ...car, status: status.value })}
                                                            >
                                                                {status.label}
                                                            </DropdownMenuItem>
                                                        ))}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setCarToDelete(car);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 size-4 text-red-600 hover:text-red-400" />
                                                            <span className='text-red-600 !hover:text-red-400'>Delete</span>

                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                    <NoCarsFound search = {search} />
                    )}
                </CardContent>
            </Card>
            <ConfirmationDialog 
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteCar}
                title="Delete Car"
                description="Are you sure you want to delete this car?"
                isLoading={deleteCarActionLoading as boolean}
                confirmButtonText="Delete Car"
                confirmButtonVariant="destructive"
                loadingText="Deleting..."
            />
        </div>
    )
}

export default CarsTable