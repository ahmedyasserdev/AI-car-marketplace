'use server';

import { CarStatus } from "@prisma/client";
import { db } from "../db";
import { fileToBase64, serializedCarData } from "../utils";
import { request } from "@arcjet/next";
import aj from "../arcjet";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getFeaturedCars = async (limit: number = 3) => {
    try {
        const cars = await db.car.findMany({
            where: {
                featured: true,
                status: CarStatus.AVAILABLE
            },
            take: limit,
            orderBy: { createdAt: "desc" }
        })

        return cars.map((car) => serializedCarData(car))
    } catch (error: any) {
        throw new Error("Error fetching featured cars", error.message)
    }
}


export const processImageSearch = async (file: File) => {
    try {
        const req = await request();

        // Check rate limit
        const decision = await aj.protect(req, {
          requested: 1, // Specify how many tokens to consume
        });
    
        if (decision.isDenied()) {
          if (decision.reason.isRateLimit()) {
            const { remaining, reset } = decision.reason;
            console.error({
              code: "RATE_LIMIT_EXCEEDED",
              details: {
                remaining,
                resetInSeconds: reset,
              },
            });
    
            throw new Error("Too many requests. Please try again later.");
          }
    
          throw new Error("Request blocked");
        }
    
        // Check if API key is available
        if (!process.env.GEMINI_API_KEY) {
          throw new Error("Gemini API key is not configured");
        }
    
        // Initialize Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
        // Convert image file to base64
        const base64Image = await fileToBase64(file);
    
        // Create image part for the model
        const imagePart = {
          inlineData: {
            data: base64Image,
            mimeType: file.type,
          },
        };
    
        // Define the prompt for car search extraction
        const prompt = `
          Analyze this car image and extract the following information for a search query:
          1. Make (manufacturer)
          2. Body type (SUV, Sedan, Hatchback, etc.)
          3. Color
    
          Format your response as a clean JSON object with these fields:
          {
            "make": "",
            "bodyType": "",
            "color": "",
            "confidence": 0.0
          }
    
          For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
          Only respond with the JSON object, nothing else.
        `;
    
        // Get response from Gemini
        const result = await model.generateContent([imagePart, prompt]);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    
        // Parse the JSON response
        try {
          const carDetails = JSON.parse(cleanedText);
    
          // Return success response with data
          return {
            success: true,
            data: carDetails,
          };
        } catch (parseError) {
          console.error("Failed to parse AI response:", parseError);
          console.log("Raw response:", text);
          return {
            success: false,
            error: "Failed to parse AI response",
          };
        }
      } catch (error : any) {
        throw new Error("AI Search error:" + error.message);
      }
    
}