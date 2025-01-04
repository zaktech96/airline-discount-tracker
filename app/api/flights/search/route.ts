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
    const dateParam = searchParams.get('date');
    const mode = searchParams.get('mode') || 'single'; // 'single' or 'calendar'
    
    console.log('Request URL:', url.toString());
    console.log('Search Parameters:', { origin, destination, dateParam, mode });

    if (!origin || !destination) {
      console.log('Missing required parameters');
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    try {
      console.log('Calling flight service...');
      
      if (mode === 'calendar') {
        const startDate = dateParam ? new Date(dateParam) : new Date();
        const prices = await flightService.getDateRangePrices(origin, destination, startDate);
        return NextResponse.json({
          success: true,
          prices,
          message: `Found prices for ${prices.filter(p => p.available).length} dates`
        });
      } else {
        const flights = await flightService.searchFlights(origin, destination, dateParam || undefined);
        return NextResponse.json({
          success: true,
          flights: flights || [],
          message: `Found ${flights?.length || 0} flights`
        });
      }
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