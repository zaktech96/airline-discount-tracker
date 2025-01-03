import axios from 'axios';
import { PrismaClient } from '@prisma/client';

// You would need to get an API key from your chosen flight data provider
const FLIGHT_API_KEY = process.env.FLIGHT_API_KEY;

interface FlightPrice {
  price: number;
  airline: string;
  flight_number: string;
}

export class FlightPriceService {
  private static instance: FlightPriceService;
  private baseUrl: string;

  private constructor() {
    // Replace with your chosen API's base URL
    this.baseUrl = 'https://api.flight-data-provider.com';
  }

  public static getInstance(): FlightPriceService {
    if (!FlightPriceService.instance) {
      FlightPriceService.instance = new FlightPriceService();
    }
    return FlightPriceService.instance;
  }

  async checkPrice(origin: string, destination: string, date?: string): Promise<FlightPrice[]> {
    try {
      // This is an example implementation. You'll need to adjust based on your chosen API
      const response = await axios.get(`${this.baseUrl}/flights/prices`, {
        headers: {
          'Authorization': `Bearer ${FLIGHT_API_KEY}`
        },
        params: {
          origin,
          destination,
          date: date || this.getDefaultSearchDate()
        }
      });

      // Transform the API response to match our interface
      // This transformation will depend on your chosen API's response format
      return response.data.flights.map((flight: any) => ({
        price: flight.price,
        airline: flight.airline,
        flight_number: flight.flight_number
      }));
    } catch (error) {
      console.error('Error fetching flight prices:', error);
      throw error;
    }
  }

  private getDefaultSearchDate(): string {
    // Default to searching flights 30 days from now
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  }
}

// Example usage of checking multiple routes
export async function checkAllRoutes() {
  const priceService = FlightPriceService.getInstance();
  const prisma = new PrismaClient();

  try {
    // Get all active routes that need price checking
    const routes = await prisma.flight_route.findMany({
      where: {
        price_alerts: {
          some: {
            is_active: true
          }
        }
      }
    });

    // Check prices for each route
    for (const route of routes) {
      try {
        const prices = await priceService.checkPrice(route.origin, route.destination);
        
        if (prices.length > 0) {
          // Get the lowest price
          const lowestPrice = prices.reduce((min, p) => p.price < min.price ? p : min);
          
          // Send the price update to our webhook
          await axios.post('/api/webhooks/flight-prices', {
            route_id: route.id,
            ...lowestPrice
          });
        }
      } catch (error) {
        console.error(`Error checking prices for route ${route.origin} to ${route.destination}:`, error);
        // Continue with other routes even if one fails
        continue;
      }
    }
  } catch (error) {
    console.error('Error in checkAllRoutes:', error);
    throw error;
  }
} 