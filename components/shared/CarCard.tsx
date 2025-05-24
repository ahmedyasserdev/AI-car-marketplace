'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { CarIcon, Heart } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { useRouter } from 'next/navigation'

type CarCardProps = {
    car: any
}

const CarCard = ({ car }: CarCardProps) => {
    const [isSaved, setIsSaved] = useState(car.wishlisted);
    const router = useRouter();
    const toggleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {

    }
    return (
        <Card className='py-0 overflow-hidden hover:shadow-lg tranistion group'>
            <div className='relative h-48'>
                {
                    car.images && car.images.length > 0 ? (
                        <div className='relative w-full h-full'>
                            <Image src={car.images[0]} alt={car.make} fill className="object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center ">
                            <CarIcon className="size-12 text-gray-400" />
                        </div>
                    )
                }

                <Button className={cn('absolute top-2 right-2 bg-white/50 rounded-full p-1.5', isSaved ? "text-red-500 hover:text-red-600" : "text-white hover:text-white/70")} variant='ghost' size='icon' effect={'gradientSlideShow'}>
                    <Heart className={cn(isSaved && "fill-current")} size={20} />
                </Button>


            </div>

            <CardContent className='p-4 '>
                <div className='flex flex-col mb-2 gap-3'>
                    <h3 className='h5-bold line-clamp-1 '>{car.make} {car.model}</h3>

                    <span className='p-bold-20 text-blue-600'>${car.price.toLocaleString()}</span>
                </div>

                <div className="text-gray-600 mb-2 flex items-center">
                    <span>{car.year}</span>
                    <span className="mx-2">•</span>
                    <span>{car.transmission}</span>
                    <span className="mx-2">•</span>
                    <span>{car.fuelType}</span>
                </div>


                <div className="flex flex-wrap gap-1 mb-4">
                    <Badge variant="outline" className="bg-gray-50">
                        {car.bodyType}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50">
                        {car.mileage.toLocaleString()} miles
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50">
                        {car.color}
                    </Badge>
                </div>



                <div className = 'w-full'>
          <Button
            onClick={() => {
              router.push(`/cars/${car.id}`);
            }}
            className="w-full "
          
          >
            View Car
          </Button>
        </div>


            </CardContent>
        </Card>
    )
}

export default CarCard