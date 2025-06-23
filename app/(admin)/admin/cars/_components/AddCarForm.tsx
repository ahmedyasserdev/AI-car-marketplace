'use client'
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ManualCarForm from "./AddManualCarForm";
import AICarForm from "./AICarForm";
import { CarStatus } from "@prisma/client";
import { carFormSchema } from "@/schemas/cars";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarFormType } from "@/types";





const AddCarForm = () => {

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("manual");

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CarFormType>({
    resolver: zodResolver(carFormSchema) as Resolver<CarFormType>,
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: CarStatus.AVAILABLE,
      featured: false,
    },
  });

  return (
    <div>
      <Tabs defaultValue="manual" onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Upload</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-6" value="manual">

          <ManualCarForm
            register={register}
            setValue={setValue}
            getValues={getValues}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            reset={reset}
            uploadedImages ={uploadedImages}
            setUploadedImages = {setUploadedImages}

          />
        </TabsContent>
        <TabsContent className="mt-6" value="ai">
          <AICarForm setActiveTab ={setActiveTab} setValue  = {setValue} setUploadedImages = {setUploadedImages} />
        </TabsContent>
      </Tabs>


    </div>
  )
}

export default AddCarForm