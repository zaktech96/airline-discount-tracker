import { generateFlightsForDate, generatePriceHistory } from './mock-flight-data';

export class FlightService {
  private static instance: FlightService;

  private constructor() {}

  public static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  async searchFlights(from: string, to: string, date: Date) {
    try {
      console.log(`Searching flights from ${from} to ${to} on ${date.toISOString().split('T')[0]}`);
      
      // Use mock data for demonstration
      const flights = generateFlightsForDate(from, to, date);
      
      if (!flights.length) {
        throw new Error(`No flights found from ${from} to ${to} on ${date.toISOString().split('T')[0]}. Try a different date or route.`);
      }

      return flights;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  }

  async getPriceHistory(from: string, to: string, days: number = 30) {
    try {
      console.log(`Getting price history for ${from} to ${to} for the last ${days} days`);
      
      // Use mock data for demonstration
      const history = generatePriceHistory(from, to, days);
      
      return history;
    } catch (error) {
      console.error('Error getting price history:', error);
      throw error;
    }
  }
}

export const flightService = FlightService.getInstance(); 