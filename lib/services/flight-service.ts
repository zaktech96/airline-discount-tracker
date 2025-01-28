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

  private getRouteKey(from: string, to: string): string | null {
    const normalizedFrom = from.toLowerCase();
    const normalizedTo = to.toLowerCase();
    
    // Check direct match
    const directKey = `${normalizedFrom}-${normalizedTo}`;
    if (POPULAR_ROUTES[directKey]) return directKey;
    
    // Check if cities are included in any route key
    for (const key of Object.keys(POPULAR_ROUTES)) {
      const [routeFrom, routeTo] = key.split('-');
      if (normalizedFrom.includes(routeFrom) && normalizedTo.includes(routeTo)) {
        return key;
      }
    }
    
    return null;
  }

  async searchFlights(from: string, to: string, date: string | Date | undefined = undefined) {
    try {
      const searchDate = date ? new Date(date) : new Date();
      console.log(`Searching flights from ${from} to ${to} on ${searchDate}`);
      
      const routeKey = this.getRouteKey(from, to);
      if (!routeKey) {
        throw new Error('No flights found for this route. Try one of our popular routes: London-Paris, London-New York, London-Dubai, Dubai-Singapore, New York-Miami');
      }

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