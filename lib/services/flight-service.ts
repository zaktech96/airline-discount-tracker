import axios from 'axios';

const API_KEY = 'e2baeb4b445729daa081842651504a1b029fc54e13d75761ce4fde8e83a54ed3';
const BASE_URL = 'https://serpapi.com/search';

interface FlightPrice {
  price: number;
  airline: string;
  flight_number: string;
  departure: {
    airport: string;
    time: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
}

export class FlightService {
  private static instance: FlightService;

  private constructor() {}

  public static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  async searchFlights(departureCity: string, arrivalCity: string): Promise<FlightPrice[]> {
    try {
      console.log('Starting flight search with params:', {
        departureCity,
        arrivalCity,
        apiKeyPresent: !!API_KEY
      });

      // Format the search query
      const params = {
        api_key: API_KEY,
        engine: 'google_flights',
        departure_id: departureCity,
        arrival_id: arrivalCity,
        hl: 'en',  // language
        gl: 'us',  // country
        currency: 'USD',
        type: 'oneway'
      };

      console.log('Making API request to:', BASE_URL);
      const response = await axios.get(BASE_URL, { params });
      console.log('API Response Status:', response.status);
      console.log('API Response Data Keys:', Object.keys(response.data));

      // Mock data for testing
      const mockFlights = [
        {
          airline: "British Airways",
          price: 450,
          flight_number: "BA123",
          departure: {
            airport: departureCity,
            time: "10:00 AM"
          },
          arrival: {
            airport: arrivalCity,
            time: "1:30 PM"
          }
        },
        {
          airline: "Air France",
          price: 380,
          flight_number: "AF456",
          departure: {
            airport: departureCity,
            time: "2:00 PM"
          },
          arrival: {
            airport: arrivalCity,
            time: "5:30 PM"
          }
        }
      ];

      return mockFlights;

    } catch (error: any) {
      console.error('Flight search error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        params: error.config?.params
      });
      
      throw new Error(`Failed to search flights: ${error.message}`);
    }
  }
}

export const flightService = FlightService.getInstance(); 