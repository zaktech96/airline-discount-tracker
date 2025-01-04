import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { flightService } from "@/lib/services/flight-service";
import { z } from "zod";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Validation schema
const requestSchema = z.object({
  origin: z.string().min(3, "City name must be at least 3 characters"),
  destination: z.string().min(3, "City name must be at least 3 characters"),
  targetPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  userId: z.string().optional().default("demo"),
});

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    console.log('Received request body:', body);

    const validatedData = requestSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Check if flights exist for this route
    try {
      console.log('Searching flights for route:', {
        origin: validatedData.origin,
        destination: validatedData.destination
      });

      const flights = await flightService.searchFlights(
        validatedData.origin,
        validatedData.destination
      );

      if (!flights || flights.length === 0) {
        return NextResponse.json(
          { error: "No flights found for this route. Please check the city names and try again." },
          { status: 400 }
        );
      }

      console.log('Found flights:', flights.length);
    } catch (error: any) {
      console.error('Flight search error:', error);
      return NextResponse.json(
        { 
          error: "Unable to verify flight route",
          details: error.message 
        },
        { status: 400 }
      );
    }

    // Create or find existing route
    const route = await prisma.flight_route.upsert({
      where: {
        origin_destination_user_id: {
          origin: validatedData.origin,
          destination: validatedData.destination,
          user_id: validatedData.userId,
        },
      },
      update: {},
      create: {
        origin: validatedData.origin,
        destination: validatedData.destination,
        user_id: validatedData.userId,
      },
    });

    // Create price alert
    const alert = await prisma.price_alert.create({
      data: {
        route_id: route.id,
        target_price: parseFloat(validatedData.targetPrice),
        user_id: validatedData.userId,
      },
      include: {
        route: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      alert,
      message: "Flight alert created successfully" 
    });
  } catch (error) {
    console.error('Error in POST /api/alerts:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
