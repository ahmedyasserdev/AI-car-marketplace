'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Camera, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import { useDropzone, FileWithPath } from 'react-dropzone'
import { toast } from "sonner"


const HomeSearch = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [isImageSearchActive, setIsImageSearchActive] = useState(false)
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setIsUploading(true);
      setSearchImage(file as any);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsUploading(false);
        toast.success("Image uploaded successfully");

      };


      reader.onerror = () => {
        setIsUploading(false);
        toast.error('failed to upload the image')
      }

      reader.readAsDataURL(file);

    }


  }
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1

  })
  const handleTextSubmit =async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm) {
      toast.error("Please enter a search term")
      return
    }

    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`)
  }

  const handleImageSearch = async(e :FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!searchImage) {
      toast.error("Please upload an image")
      return
    }

  //  add the AI logic here 
  }

  const handleRemovingImage = () => {
    setImagePreview('')
    setSearchImage(null)
    toast.info("Image removed")
  }
  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Enter make, model, or use our AI image search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm "
          />
          <div className="absolute right-[100px]">
            <Camera
              size={35}
              onClick={() => setIsImageSearchActive((prev) => !prev)}
              className={cn("cursor-pointer rounded-xl  p-1.5", isImageSearchActive && 'bg-black text-white')}
            />
          </div>
          <Button type="submit" className='absolute rounded-full right-2'>
            Search
          </Button>
        </div>
      </form>


      {
        isImageSearchActive && (
          <div className='mt-4'>
            <form onSubmit={handleImageSearch}>
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center">
                {
                  imagePreview ? (
                    <div className="flex items-center flex-col">
                      <img src={imagePreview} alt="Car Preview" className='h-40 object-contain mb-4' />
                      <Button variant='outline' onClick={handleRemovingImage}>
                        Remove image
                        </Button>
                    </div>
                  ) : (
                    <div className="cursor-pointer" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center text-gray-500 ">
                      <Upload className="size-12 text-gray-400 mb-2" />
                      {
                        isDragActive && !isDragReject ? (
                          <p>Leave the files here to upload</p>
                        ) : (
                          <p>Drag and Drop Car image or click to select</p>
                        )
                      }
                         {
                        isDragReject && (
                          <p className="text-red-500 mt-2">Invalid image type</p>
                        )
                      }

                      <p className="text-gray-400 text-sm my-2" >
                        Supports : JPG , PNG (max 5MB)
                      </p>
                      </div>

                   

                    </div>
                  )
                }

              </div>


                      {
                        imagePreview && (
                          <Button className="w-full mt-2"  disabled = {isUploading}>
                            {isUploading ? "Uploading..." :"Search with image"}
                          </Button>
                        )
                      }

            </form>
          </div>
        )
      }
    </div>


  )
}

export default HomeSearch