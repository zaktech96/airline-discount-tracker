import { NextResponse } from "next/server";
import { flightService } from "@/lib/services/flight-service";

export async function GET(req: Request) {
  console.log('=== Flight Search API Start ===');
  
  try {
    // Log the incoming request
    const url = new URL(req.url);
    const { searchParams } = url;
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    
    console.log('Request URL:', url.toString());
    console.log('Search Parameters:', { origin, destination });

    if (!origin || !destination) {
      console.log('Missing required parameters');
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    try {
      console.log('Calling flight service...');
      const flights = await flightService.searchFlights(origin, destination);
      console.log('Flights found:', flights?.length || 0);
      
      return NextResponse.json({
        success: true,
        flights: flights || [],
        message: `Found ${flights?.length || 0} flights`
      });
    } catch (serviceError: any) {
      console.error('Flight service error:', {
        message: serviceError.message,
        stack: serviceError.stack,
        response: serviceError.response?.data
      });
      
      return NextResponse.json(
        { 
          error: "Error searching flights",
          details: serviceError.message,
          success: false
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('=== Flight Search API Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message,
        success: false
      },
      { status: 500 }
    );
  }
} 