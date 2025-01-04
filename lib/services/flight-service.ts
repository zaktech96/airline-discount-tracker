import axios from 'axios';
import config from '@/lib/config';

const API_KEY = config.serpApi.apiKey;
const BASE_URL = config.serpApi.baseUrl;

// Mock data for testing different scenarios
const MOCK_FLIGHTS = [
  {
    airline: "British Airways",
    price: 450,
    flight_number: "BA346",
    departure: {
      airport: "London Heathrow (LHR)",
      time: "07:30 AM"
    },
    arrival: {
      airport: "Paris Charles de Gaulle (CDG)",
      time: "09:45 AM"
    }
  },
  {
    airline: "Air France",
    price: 380,
    flight_number: "AF1681",
    departure: {
      airport: "London Gatwick (LGW)",
      time: "10:15 AM"
    },
    arrival: {
      airport: "Paris Orly (ORY)",
      time: "12:30 PM"
    }
  },
  {
    airline: "EasyJet",
    price: 220,
    flight_number: "EZY8463",
    departure: {
      airport: "London Luton (LTN)",
      time: "14:45 PM"
    },
    arrival: {
      airport: "Paris Charles de Gaulle (CDG)",
      time: "17:00 PM"
    }
  },
  {
    airline: "Ryanair",
    price: 175,
    flight_number: "FR1123",
    departure: {
      airport: "London Stansted (STN)",
      time: "16:20 PM"
    },
    arrival: {
      airport: "Paris Beauvais (BVA)",
      time: "18:35 PM"
    }
  },
  {
    airline: "Vueling",
    price: 310,
    flight_number: "VY8765",
    departure: {
      airport: "London Gatwick (LGW)",
      time: "19:00 PM"
    },
    arrival: {
      airport: "Paris Orly (ORY)",
      time: "21:15 PM"
    }
  }
];

// Common city pairs for testing
const TEST_ROUTES = {
  'London-Paris': {
    distance: '344 km',
    flightTime: '~1h 15m',
    airports: {
      departure: ['LHR', 'LGW', 'LTN', 'STN'],
      arrival: ['CDG', 'ORY', 'BVA']
    }
  },
  'New York-London': {
    distance: '5,567 km',
    flightTime: '~7h 30m',
    airports: {
      departure: ['JFK', 'EWR', 'LGA'],
      arrival: ['LHR', 'LGW', 'STN']
    }
  },
  'Tokyo-Seoul': {
    distance: '1,157 km',
    flightTime: '~2h 15m',
    airports: {
      departure: ['NRT', 'HND'],
      arrival: ['ICN', 'GMP']
    }
  }
};

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

  private constructor() {
    console.log('FlightService instance created');
    console.log('API Configuration:', {
      hasApiKey: !!API_KEY,
      apiKeyLength: API_KEY?.length || 0,
      baseUrl: BASE_URL
    });
  }

  public static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  async searchFlights(departureCity: string, arrivalCity: string): Promise<FlightPrice[]> {
    try {
      console.log('=== Flight Service Search Start ===');
      console.log('Search parameters:', {
        departureCity,
        arrivalCity,
        hasApiKey: !!API_KEY
      });

      // For now, return mock data while we debug the API integration
      console.log('Returning mock flight data for testing');
      
      // Randomize prices slightly to simulate real-time changes
      return MOCK_FLIGHTS.map(flight => ({
        ...flight,
        price: Math.round(flight.price * (0.9 + Math.random() * 0.2)), // ±10% price variation
        departure: {
          ...flight.departure,
          airport: flight.departure.airport.replace('London', departureCity)
                                        .replace('Paris', arrivalCity)
        },
        arrival: {
          ...flight.arrival,
          airport: flight.arrival.airport.replace('London', departureCity)
                                      .replace('Paris', arrivalCity)
        }
      }));

    } catch (error: any) {
      console.error('=== Flight Service Error ===');
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      throw new Error(`Failed to search flights: ${error.message}`);
    }
  }
}

export const flightService = FlightService.getInstance(); 