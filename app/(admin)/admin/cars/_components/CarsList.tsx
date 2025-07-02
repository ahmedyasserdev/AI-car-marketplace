'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFetch } from "@/hooks/useFetch"
import { getCars } from "@/lib/actions/cars.actions"
import { PlusIcon, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CarsTable from "./CarsTable"
import { SerializedCarType } from "@/types"

const CarsList = () => {
    const [search , setSearch] = useState("");
    const router = useRouter();
    const {
        loading ,
        data : getCarsData ,
        error ,
        fn : getCarsFn,
        setData  : setCars
    } = useFetch(getCars)
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    useEffect(() => {
            getCarsFn(search)
    }, [search])
    
    return (
        <div className = "space-y-6">
            <div className = "flex flex-col sm:flex-row  gap-4 items-start sm:items-center justify-between" >
                <Button  className = "flex items-center" onClick = {() => router.push("/admin/cars/create")}>
                        <PlusIcon className="size-4"/>  Add a car
                </Button>


                <form onSubmit = {handleSearchSubmit} className = 'flex w-full sm:w-auto'>
                    <div className = 'relative flex-1'>
                        <Search className = "absolute left-2.5 top-2.5 size-4 text-gray-500" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={"Search cars"}
                        className = " w-full pl-6 sm:w-60 " /> 
                    </div>
                </form>
                </div>

              


              <CarsTable 
                search={search} 
                //@ts-ignore
                getCarsFn={getCarsFn} 
                success={getCarsData?.success} 
                cars={getCarsData?.cars} 
                loading={loading}
              />
        </div>
    )
}

export default CarsList