'use client'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carFormSchema } from "@/schemas/cars";
import { CarStatus } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TextField from "@/components/shared/TextField";
import SelectField from "@/components/shared/SelectField";
import { Label } from "@/components/ui/label";
import { FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { createNewCar } from "@/lib/actions/cars.actions";
import { z } from "zod";
import { useRouter } from "next/navigation";





const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup",
];
const carStatuses = [CarStatus.AVAILABLE, CarStatus.UNAVAILABLE, CarStatus.SOLD];


const AddCarForm = () => {
  const [activeTab, setActiveTab] = useState("ai");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const { data: newCar, error, loading, setData, fn: addCarFn } = useFetch(createNewCar)
  const router = useRouter()

  const onMultiImagesDrop = (acceptedFiles: FileWithPath[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(` ${file.name} exceeds 5MB limit and will be skipped`);
        return false
      }
      return true
    })

    if (!validFiles.length) return;

    const newImages: [] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {

        newImages.push(e?.target?.result)
        if (newImages.length === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages])
          setImageError("")
          toast.success(` ${validFiles.length} Images uploaded successfully`);
        }

        setIsUploading(false);

      };


      reader.onerror = () => {
        setIsUploading(false);
        toast.error('failed to upload the image')
      }

      reader.readAsDataURL(file);
    })
  }
  const { getRootProps: getMultiImageProps, getInputProps: getMultiImageInputProps, } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,

  })

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
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

  const onSubmit = async (data: z.infer<typeof carFormSchema>) => {
    if (!uploadedImages.length) {
      setImageError("Please upload at least one")
      return;
    }

    const carData = {
      ...data,
      year: parseInt(data.year),
      price: parseInt(data.price),
      mileage: parseInt(data.mileage),
      seats: data.seats ? parseInt(data.seats) : undefined,
    };

    await addCarFn({ carData, images: uploadedImages });

      if (newCar?.success) {
        toast.success(newCar?.message)
        router.push("/admin/cars");
      } 

  }


  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index))
  }

  return (
    <div>
      <Tabs defaultValue="manual" onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Upload</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-6" value="manual">

          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>Enter the details of the car you want to add.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <TextField
                    label="Make"
                    placeholder="e.g Toyota"
                    register={register}
                    error={errors.make}
                    id="make"
                  />
                  <TextField
                    label="Model"
                    placeholder="e.g Camry "
                    register={register}
                    error={errors.model}
                    id="model"
                  />
                  <TextField
                    label="Year"
                    placeholder="e.g 2020 "
                    register={register}
                    error={errors.year}
                    id="year"
                  />
                  <TextField
                    label="Price($)"
                    placeholder="e.g 25000  "
                    register={register}
                    error={errors.price}
                    id="price"
                  />
                  <TextField
                    label="Mileage"
                    placeholder="e.g 15000"
                    register={register}
                    error={errors.mileage}
                    id="mileage"
                  />
                  <TextField
                    label="Color"
                    placeholder="e.g Blue"
                    register={register}
                    error={errors.color}
                    id="color"
                  />


                  <SelectField
                    id="fuelType"
                    label="Fuel Type"
                    placeholder="Select Fuel Type"
                    options={fuelTypes}
                    onValueChange={(value) => setValue("fuelType", value)}
                    defaultValue={getValues("fuelType")}
                    error={errors.fuelType}
                  />

                  <SelectField
                    id="transmission"
                    label="Transmissions"
                    placeholder="Select Transmissions"
                    options={transmissions}
                    onValueChange={(value) => setValue("transmission", value)}
                    defaultValue={getValues("transmission")}
                    error={errors.transmission}

                  />


                  <SelectField
                    id="bodyType"
                    label="Body Types"
                    placeholder="Select Body Type"
                    options={bodyTypes}
                    onValueChange={(value) => setValue("bodyType", value)}
                    defaultValue={getValues("bodyType")}
                    error={errors.bodyType}

                  />


                  <TextField
                    label="Number of Seats (Optional)"
                    placeholder="e.g 5"
                    register={register}
                    error={errors.seats}
                    id="seats"
                  />





                  <SelectField
                    id="status"
                    label="Car Status"
                    placeholder="Select Car Status"
                    options={carStatuses}
                    onValueChange={(value) => setValue("status", value as CarStatus)}
                    defaultValue={getValues("status")}
                    error={errors.status}
                  />




                  <div
                    className="col-span-1 sm:col-span-2 lg:col-span-3"
                  >
                    <TextField
                      label="Description"
                      textarea={true}
                      placeholder="Enter car description"
                      register={register}
                      error={errors.description}
                      id="description"
                      className="h-48"
                    />
                  </div>

                  <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 col-span-1 sm:col-span-2 lg:col-span-3">
                    <Checkbox
                      id="featured"
                      checked={watch("featured")}
                      onCheckedChange={(checked: boolean) => {
                        setValue("featured", checked);
                      }}
                    />

                    <div className="space-y-1 leading-none">
                      <Label htmlFor="featured">Feature this car</Label>
                      <p className="text-sm text-gray-500">
                        Featured cars appear on the homepage
                      </p>
                    </div>
                  </div>




                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 space-y-2">
                    <Label htmlFor='images' className={cn(imageError && "text-red-500")}>
                      Images{" "}
                      {imageError && <span>(*)</span>}
                    </Label>



                    <div
                      className={cn(
                        `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition ${imageError ? "border-red-500" : "border-gray-300"
                        }`
                      )}

                      {...getMultiImageProps()}>
                      <input id="images" {...getMultiImageInputProps()} />
                      <div className="flex flex-col items-center text-gray-500 ">
                        <Upload className="size-12 text-gray-400 mb-2" />
                        <p>Drag and Drop or click to upload</p>

                        <p className="text-gray-400 text-sm my-2" >
                          Supports : JPG , PNG (max 5MB)
                        </p>









                      </div>
                    </div>



                  </div>




                  {
                    imageError && (
                      <p className="text-xs text-red-500 mt-1">{imageError}</p>
                    )
                  }


                </div>

                {
                  uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <h3 className="p-medium-24">Uploaded images ({uploadedImages.length})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className='relative group'>
                            <Image
                              className="h-28  rounded-lg object-contain w-full"
                              priority
                              width={50} height={50} src={image} alt={`car image ${index}`} />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="size-3 text-white" />
                            </Button>
                          </div>
                        ))}
                      </div>

                    </div>
                  )
                }

                <Button className="w-full p-medium-20 mt-6" disabled={loading as boolean} >
                  {
                    loading ? (
                      <>
                        Adding Car....
                        <Loader2 className="animate-spin size-5 ml-2" />
                      </>
                    ) : "Add Car"
                  }

                </Button>

              </form>

            </CardContent>

          </Card>

        </TabsContent>
        <TabsContent className="mt-6" value="ai">Change your password here.</TabsContent>
      </Tabs>


    </div>
  )
}

export default AddCarForm