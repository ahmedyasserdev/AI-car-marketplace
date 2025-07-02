import { FieldErrors, UseFormRegister, UseFormWatch, UseFormHandleSubmit, UseFormSetValue, UseFormGetValues, UseFormReset } from "react-hook-form";
import { z } from "zod";
import { carFormSchema } from "./schemas/cars";
import { CarStatus } from "@prisma/client";


export type CarFormType = z.infer<typeof carFormSchema>;

export interface ManualCarFormProps {
    reset: UseFormReset<CarFormType>;
    handleSubmit: UseFormHandleSubmit<CarFormType>;
    watch: UseFormWatch<CarFormType>;
    register: UseFormRegister<CarFormType>;
    errors: FieldErrors<CarFormType>;
    setValue: UseFormSetValue<CarFormType>;
    getValues: UseFormGetValues<CarFormType>;
    uploadedImages : string[] ;
    setUploadedImages : React.Dispatch<React.SetStateAction<string[]>>;
  }
  

  export type SerializedCarType = {
    id: string
    make: string
    model: string
    year: number
    price?: number
    mileage: number
    color: string
    fuelType: string
    transmission: string
    bodyType: string
    seats: number | null
    description: string
    status: CarStatus
    featured: boolean
    images: string[]
    createdAt: string
    updatedAt: string
  }