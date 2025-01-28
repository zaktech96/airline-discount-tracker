import { MOCK_FLIGHTS, POPULAR_ROUTES, generateFlightsForDate, generatePriceVariation } from './mock-flight-data';

export class FlightService {
  private static instance: FlightService;

  private constructor() {}

  public static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  async searchFlights(from: string, to: string, date?: string | Date) {
    try {
      const searchDate = date ? new Date(date) : new Date();
      console.log(`Searching flights from ${from} to ${to} on ${searchDate}`);
      
      // Normalize city names to match mock data
      const normalizedFrom = from.toLowerCase();
      const normalizedTo = to.toLowerCase();
      
      // Check if this is the London-Paris route
      if (normalizedFrom.includes('london') && normalizedTo.includes('paris')) {
        const flights = generateFlightsForDate('london', 'paris', searchDate);
        return flights;
      }

      throw new Error('No flights found for this route. Try London to Paris for demo data.');
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  }

  async getDateRangePrices(from: string, to: string, startDate: Date) {
    const prices = [];
    const normalizedFrom = from.toLowerCase();
    const normalizedTo = to.toLowerCase();
    
    // Only return data for London-Paris route
    if (normalizedFrom.includes('london') && normalizedTo.includes('paris')) {
      const basePrice = 150; // Base price for London-Paris route
      
      // Generate prices for next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        const price = generatePriceVariation(basePrice, date);
        prices.push({
          date: date.toISOString().split('T')[0],
          price,
          available: Math.random() > 0.2 // 80% chance of availability
        });
      }
    }
    
    return prices;
  }
}

export const flightService = FlightService.getInstance(); 