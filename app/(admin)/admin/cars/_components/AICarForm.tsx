'use client'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useFetch } from "@/hooks/useFetch"
import { processCarImageAI } from "@/lib/actions/cars.actions"
import { CarFormType } from "@/types"
import { Camera, Loader2, Trash, } from "lucide-react"
import { useEffect, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import { UseFormSetValue } from "react-hook-form"
import { toast } from "sonner"

type AiFormProps = {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>,
    setValue: UseFormSetValue<CarFormType>,
    setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>;
}



const AICarForm = ({ setValue, setUploadedImages, setActiveTab }: AiFormProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedAiImage, setUploadedAiImage] = useState<File | null>(null);
    const { data: processImageResult, fn: processImageFn, loading, error } = useFetch(processCarImageAI)

    const onAIDrop = (acceptedFiles: FileWithPath[]) => {
        const file = acceptedFiles[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }

            setUploadedAiImage(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
                toast.success("Image uploaded successfully");

            };



            reader.readAsDataURL(file);

        }


    }

    const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } = useDropzone({
        onDrop: onAIDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        multiple: false,
        maxFiles: 1,
    });

    const handleRemoveImage = () => {
        setImagePreview(null);
        setUploadedAiImage(null);
    }


    const processWithAI = async () => {
        if (!uploadedAiImage) {
            toast.error("Please upload an image first");
            return;
        }


        await processImageFn(uploadedAiImage as File);

    }


    useEffect(() => {
        if (error) toast.error(error.message || "Something went wrong");
    }, [error])

    useEffect(() => {

        if (processImageResult?.success) {
            toast.success("Car details extracted successfully");
        }
        const carDetails = processImageResult?.data;
        if (!carDetails) return;
        setValue("make", carDetails.make);
        setValue("model", carDetails.model);
        setValue("year", carDetails.year.toString());
        setValue("color", carDetails.color);
        setValue("bodyType", carDetails.bodyType);
        setValue("fuelType", carDetails.fuelType);
        setValue("price", carDetails.price);
        setValue("mileage", carDetails.mileage);
        setValue("transmission", carDetails.transmission);
        setValue("description", carDetails.description);

        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImages((prev) => [...prev, e.target?.result as string]);
            toast.success("Image uploaded successfully");
        };

        reader.readAsDataURL(uploadedAiImage as File);
        toast.success("Successfully extracted car details", {
            description: `Detected ${carDetails.year} ${carDetails.make} ${carDetails.model
                } with ${Math.round(carDetails.confidence * 100)}% confidence`,
        });

        setActiveTab("manual");


    }, [processImageResult, setValue, uploadedAiImage])



    return (
        <Card>
            <CardHeader>
                <CardTitle>AI-Powered Car Details Extraction</CardTitle>
                <CardDescription>
                    Upload an image of a car and let Gemini AI extract its details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center ">
                        {
                            imagePreview ?
                                <div className="flex flex-col items-center">
                                    <img src={imagePreview} alt="Car Preview"
                                        className='max-h-56 max-w-full object-contain mb-4'
                                    />
                                    <div className="flex gap-2 ">
                                        <Button variant={'outline'} size="sm"
                                            onClick={handleRemoveImage}
                                        >
                                            Remove
                                        </Button>
                                        <Button size="sm"
                                            onClick={processWithAI}
                                            disabled={loading as boolean}
                                        >
                                            {
                                                loading ? (
                                                    <>
                                                        <Loader2 className="size-4 mr-2 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Camera className="size-4 mr-2" />
                                                        Extract details
                                                    </>
                                                )
                                            }
                                        </Button>
                                    </div>
                                </div>
                                :
                                (
                                    <div className="cursor-pointer hover:bg-gray-50 transition" {...getAiRootProps()}>
                                        <input {...getAiInputProps()} />
                                        <div className="flex flex-col items-center text-gray-500 ">
                                            <Camera className="size-12 text-gray-400 mb-2" />
                                            <p>Drag and Drop Car image or click to select</p>
                                            <p className="text-gray-400 text-xs my-2" >
                                                Supports : JPG , PNG (max 5MB)
                                            </p>
                                        </div>



                                    </div>
                                )
                        }


                    </div>


                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium mb-2">How it works</h3>
                        <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
                            <li>Upload a clear image of the car</li>
                            <li>Click "Extract Details" to analyze with Gemini AI</li>
                            <li>Review the extracted information</li>
                            <li>Fill in any missing details manually</li>
                            <li>Add the car to your inventory</li>
                        </ol>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-md">
                        <h3 className="font-medium text-amber-800 mb-1">
                            Tips for best results
                        </h3>
                        <ul className="space-y-1 text-sm text-amber-700">
                            <li>• Use clear, well-lit images</li>
                            <li>• Try to capture the entire vehicle</li>
                            <li>• For difficult models, use multiple views</li>
                            <li>• Always verify AI-extracted information</li>
                        </ul>
                    </div>


                </div>


            </CardContent>
        </Card>
    )
}

export default AICarForm