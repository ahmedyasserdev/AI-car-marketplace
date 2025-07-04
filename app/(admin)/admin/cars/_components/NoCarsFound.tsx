'use client'
import { Button } from '@/components/ui/button'
import { CarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const NoCarsFound = ({search} : {search : string}) => {
    const router = useRouter()
  return (
    <div className=" flex-col flex-center py-12 px-4 text-center">
                        <CarIcon className="size-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No cars found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {search
                            ? "No cars match your search criteria"
                            : "Your inventory is empty. Add cars to get started."}
                        </p>
                        <Button onClick={() => router.push("/admin/cars/create")}>
                          Add Your First Car
                        </Button>
                      </div>
  )
}

export default NoCarsFound