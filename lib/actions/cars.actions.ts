'use server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { fileToBase64, serializedCarData } from '../utils'
import { authenticateUser, getUserByClerkId } from './user'
import { auth } from '@clerk/nextjs/server'
import { v4 as uuidv4 } from "uuid";
import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { db } from '../db'
import { revalidatePath } from 'next/cache'
import { Car, CarStatus } from '@prisma/client'
import { SerializedCarType } from '@/types'

type CarAIResult = {
  make: string;
  model: string;
  year: number;
  color: string;
  price: string;
  mileage: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  description: string;
  confidence: number;
};

type ProcessCarImageResult = {
  success: true;
  data: CarAIResult;
} | undefined;




export const processCarImageAI = async (file: File): Promise<ProcessCarImageResult> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('No CAR_IMAGE_UPLOAD_URL provided!')
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const base64Image = await fileToBase64(file);
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type
      }
    }

    const prompt = `
        Analyze this car image and extract the following information:
        1. Make (manufacturer)
        2. Model
        3. Year (approximately)
        4. Color
        5. Body type (SUV, Sedan, Hatchback, etc.)
        6. Mileage
        7. Fuel type (your best guess)
        8. Transmission type (your best guess)
        9. Price (your best guess)
        9. Short Description as to be added to a car listing
  
        Format your response as a clean JSON object with these fields:
        {
          "make": "",
          "model": "",
          "year": 0000,
          "color": "",
          "price": "",
          "mileage": "",
          "bodyType": "",
          "fuelType": "",
          "transmission": "",
          "description": "",
          "confidence": 0.0
        }
  
        For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
        Only respond with the JSON object, nothing else.
      `;

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const carDetails = JSON.parse(cleanedText);

    const requiredFields = [
      "make",
      "model",
      "year",
      "color",
      "bodyType",
      "price",
      "mileage",
      "fuelType",
      "transmission",
      "description",
      "confidence",
    ];

    const missingFields = requiredFields.filter(
      (field) => !(field in carDetails)
    );

    if (missingFields.length > 0) {
      throw new Error(
        `AI response missing required fields: ${missingFields.join(", ")}`
      );
    }

    return {
      success: true,
      data: carDetails,
    };



  } catch (error) {
    console.log('Error processing car image', error)
  }
}

type CarData = {
  make: string
  model: string
  year: number
  price: number
  mileage: number
  color: string
  fuelType: string
  transmission: string
  bodyType: string
  seats?: number
  description: string
  status?: "AVAILABLE" | "UNAVAILABLE" | "SOLD"
  featured?: boolean
}

export const createNewCar = async ({ carData, images }: { carData: CarData, images: string[] }): Promise<{ success: boolean, message: string, data: Car } | undefined> => {
  try {
     await authenticateUser();
    

    const carId = uuidv4();
    const folderPath = `cars/${carId}`

    const cookieStore = await cookies();
    //@ts-expect-error
    const supabase = createClient(cookieStore);
    const imageUrls = []

    for (let i = 0; i < images.length; i++) {
      const base64Data: string = images[i];

      // Skip if image data is not valid
      if (!base64Data || !base64Data.startsWith("data:image/")) {
        console.warn("Skipping invalid image data");
        continue;
      }

      const base64 = base64Data.split(",")[1];
      const imageBuffer = Buffer.from(base64, 'base64')
      const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
      const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";
      const fileName = `image-${Date.now()}-${i}.${fileExtension}`;
      const filePath = `${folderPath}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("car-images")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.error("Error uploading image:", error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`; // disable cache in config

      imageUrls.push(publicUrl);

    }
    if (imageUrls.length === 0) {
      throw new Error("No valid images were uploaded");
    }

    const newCar = await db.car.create({
      data: {
        id: carId, // Use the same ID we used for the folder
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        color: carData.color,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        bodyType: carData.bodyType,
        seats: carData.seats,
        description: carData.description,
        status: carData.status,
        featured: carData.featured,
        images: imageUrls, // Store the array of image URLs
      },
    });
    revalidatePath("/admin/cars");

    return {
      success: true,
      message: "Car created successfully",
      data: newCar
    };


  } catch (error: any) {
    throw new Error("Error adding car:" + error.message);
  }
}


export const getCars = async (search: string = '') : Promise<{cars : SerializedCarType[] , error?: string , success:boolean}>  => {
  try {
    await authenticateUser();
    let where: any = {};

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { color: { contains: search, mode: "insensitive" } },
      ];
    }


    const cars = await db.car.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      }
    })

    const serializedCars = cars.map((car) => serializedCarData(car));

    return {
      success: true,
      cars: serializedCars
    }
  } catch (error: any) {
    console.error("Error fetching cars:", error);
    return {
      success: false,
      error: error.message,
      cars : []
    };
  }
}

type FnReturnResult = Promise<{message?: string , error?:string , success?:boolean}>


export const deleteCar = async (carId: string) : FnReturnResult => {
  try {
     await authenticateUser()
    const car = await db.car.findUnique({
      where: {
        id: carId
      },
      select: {
        images: true
      }
    })

    if (!car) return { success: false, error: "Car not found" }

    await db.car.delete({
      where: {
        id: carId
      }
    })

    const cookieStore = await cookies();
    //@ts-expect-error
    const supabase = createClient(cookieStore);

    const filePaths = car.images.map((imageUrl) => {
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/car-images\/(.*)/);
      return pathMatch ? pathMatch[1] : null;
    }).filter(Boolean);

    if (filePaths.length > 0) {
      const { error } = await supabase.storage.from("car-images").remove(filePaths as string[]);

      if (error) {
        console.error("Error deleting images:", error);
        throw new Error(`Failed to delete images: ${error.message}`);
      }

    }


    revalidatePath("/admin/cars");

    return { success: true, message: "Car deleted successfully" }

  } catch (error  : any) {
    console.error("Error deleting cars:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export const updateCar = 
async ({ id, status, featured }: { id: string, status?: CarStatus, featured?: boolean })  : FnReturnResult=> {
  try {
   await authenticateUser()

    const updateData: { status?: CarStatus, featured?: boolean } = {}

    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;

    await db.car.update({
      where  : {id },
      data : updateData
    })

    revalidatePath("/admin/cars");


      return {
        success : true , 
        message: "updates car successfully"
      }

  } catch (error :any) {
    console.error("Error Updating cars:", error);
    return {
      success: false,
      error: error.message,
    };
  }

}
