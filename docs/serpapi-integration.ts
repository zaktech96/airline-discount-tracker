// SerpAPI Google Flights Integration

import axios from 'axios';
import config from '@/lib/config';

const SERPAPI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FLIGHT_API_KEY,
  baseUrl: 'https://serpapi.com/search',
  params: {
    engine: 'google_flights',
    currency: 'USD'
  }
};

// Flight Search Function
const searchFlights = async (params: {
  origin: string;
  destination: string;
  date?: string;
}) => {
  try {
    const response = await axios.get(SERPAPI_CONFIG.baseUrl, {
      params: {
        ...SERPAPI_CONFIG.params,
        api_key: SERPAPI_CONFIG.apiKey,
        departure_id: params.origin,
        arrival_id: params.destination,
        outbound_date: params.date
      }
    });

    // Transform SerpAPI response to match our interface
    return response.data.flights.map((flight: any) => ({
      airline: flight.airline,
      flight_number: flight.flight_number,
      price: flight.price.total,
      departure: {
        airport: flight.departure.airport,
        time: flight.departure.time
      },
      arrival: {
        airport: flight.arrival.airport,
        time: flight.arrival.time
      }
    }));
  } catch (error) {
    console.error('SerpAPI search error:', error);
    throw error;
  }
};

// Usage example:
// 1. Get your API key from https://serpapi.com/
// 2. Add to .env: NEXT_PUBLIC_FLIGHT_API_KEY=your_api_key
// 3. Use in component:
/*
const flights = await searchFlights({
  origin: 'LHR',
  destination: 'CDG',
  date: '2024-02-01'
});
*/ 