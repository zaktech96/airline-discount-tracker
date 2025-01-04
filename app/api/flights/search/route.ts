import { NextResponse } from "next/server";
import { flightService } from "@/lib/services/flight-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    console.log('Searching flights:', { origin, destination });

    const flights = await flightService.searchFlights(origin, destination);
    
    return NextResponse.json({
      success: true,
      flights,
      message: `Found ${flights.length} flights`
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to search flights",
        success: false
      },
      { status: 500 }
    );
  }
} 