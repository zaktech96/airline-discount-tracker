import axios from 'axios';
import config from '@/lib/config';

const API_KEY = config.serpApi.apiKey;
const BASE_URL = 'https://serpapi.com/search.json';

// Common airport codes for major cities
const CITY_TO_AIRPORT: { [key: string]: string } = {
  'london': 'LHR',
  'paris': 'CDG',
  'new york': 'JFK',
  'tokyo': 'HND',
  'beijing': 'PEK',
  'dubai': 'DXB',
  'singapore': 'SIN',
  'hong kong': 'HKG',
  'seoul': 'ICN',
  'sydney': 'SYD',
  'los angeles': 'LAX',
  'chicago': 'ORD',
  'toronto': 'YYZ',
  'frankfurt': 'FRA',
  'amsterdam': 'AMS',
  'madrid': 'MAD',
  'rome': 'FCO',
  'istanbul': 'IST',
  'bangkok': 'BKK',
  'mumbai': 'BOM'
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

interface DatePrice {
  date: string;
  price: number;
  available: boolean;
}

export class FlightService {
  private static instance: FlightService;

  private constructor() {
    console.log('FlightService instance created');
    console.log('API Configuration:', {
      hasApiKey: !!API_KEY,
      baseUrl: BASE_URL
    });
  }

  public static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  private getCityAirportCode(city: string): string {
    const normalizedCity = city.toLowerCase().trim();
    const airportCode = CITY_TO_AIRPORT[normalizedCity];
    
    if (!airportCode) {
      // If it looks like an airport code already, return it uppercase
      if (city.length === 3 && /^[A-Za-z]{3}$/.test(city)) {
        return city.toUpperCase();
      }
      throw new Error(`No airport code found for city: ${city}. Please use a 3-letter airport code (e.g., LHR for London) or a supported city name.`);
    }
    
    return airportCode;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  async getDateRangePrices(
    departureCity: string, 
    arrivalCity: string, 
    startDate: Date = new Date()
  ): Promise<DatePrice[]> {
    try {
      const departureCode = this.getCityAirportCode(departureCity);
      const arrivalCode = this.getCityAirportCode(arrivalCity);
      
      // Get prices for next 30 days
      const dates: DatePrice[] = [];
      const promises = [];

      // Start from tomorrow
      startDate = this.addDays(startDate, 1);
      
      console.log('Fetching prices for date range:', {
        departureCity,
        departureCode,
        arrivalCity,
        arrivalCode,
        startDate: this.formatDate(startDate)
      });

      // Create an array of 30 dates
      for (let i = 0; i < 30; i++) {
        const currentDate = this.addDays(startDate, i);
        const formattedDate = this.formatDate(currentDate);
        
        const params = {
          api_key: API_KEY,
          engine: 'google_flights',
          departure_id: departureCode,
          arrival_id: arrivalCode,
          outbound_date: formattedDate,
          currency: 'USD',
          hl: 'en',
          type: '2',
          gl: 'us',
          num: '50'
        };

        // Store the date and create the promise
        dates.push({
          date: formattedDate,
          price: 0,
          available: false
        });

        promises.push(
          axios.get(BASE_URL, { params })
            .then(response => {
              const flights = response.data.flights_data || 
                            response.data.best_flights?.oneway || 
                            response.data.other_flights?.oneway || 
                            response.data.flights_results || 
                            [];
              
              if (flights.length > 0) {
                // Find the lowest price for this date
                const lowestPrice = Math.min(...flights.map((flight: any) => 
                  parseFloat(String(flight.price?.total || flight.price).replace(/[^0-9.]/g, '') || '999999')
                ));
                
                // Update the date entry
                const dateEntry = dates.find(d => d.date === formattedDate);
                if (dateEntry) {
                  dateEntry.price = lowestPrice;
                  dateEntry.available = true;
                }

                console.log(`Found ${flights.length} flights for ${formattedDate}, lowest price: ${lowestPrice}`);
              } else {
                console.log(`No flights found for ${formattedDate}`);
              }
            })
            .catch(error => {
              console.error(`Error fetching price for ${formattedDate}:`, error.message);
              if (error.response?.data?.error) {
                console.error('API Error:', error.response.data.error);
              }
            })
        );
      }

      // Wait for all requests to complete
      await Promise.all(promises);

      // Sort dates chronologically
      dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return dates;

    } catch (error: any) {
      console.error('Error fetching date range prices:', error);
      throw new Error(`Failed to fetch price calendar: ${error.message}`);
    }
  }

  async searchFlights(departureCity: string, arrivalCity: string, searchDate?: string): Promise<FlightPrice[]> {
    try {
      console.log('=== Flight Service Search Start ===');
      
      // Convert city names to airport codes
      const departureCode = this.getCityAirportCode(departureCity);
      const arrivalCode = this.getCityAirportCode(arrivalCity);
      
      console.log('Search parameters:', {
        departureCity,
        departureCode,
        arrivalCity,
        arrivalCode,
        searchDate,
        hasApiKey: !!API_KEY
      });

      if (!API_KEY) {
        throw new Error('API key is not configured');
      }

      // Use provided date or default to 1 month from now
      let outboundDate: string;
      if (searchDate) {
        outboundDate = searchDate;
      } else {
        // Default to next month
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        // Set to the first of the month to ensure availability
        date.setDate(1);
        outboundDate = this.formatDate(date);
      }

      // Ensure the date is in YYYY-MM-DD format
      if (!outboundDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
      }

      console.log('Search date:', outboundDate);

      // Format the search query
      const params = {
        api_key: API_KEY,
        engine: 'google_flights',
        departure_id: departureCode,
        arrival_id: arrivalCode,
        outbound_date: outboundDate,
        currency: 'USD',
        hl: 'en',
        type: '2',  // 2 for one-way trip
        gl: 'us',   // country code
        num: '50'   // number of results
      };

      console.log('Making API request to SerpAPI...');
      const requestUrl = new URL(BASE_URL);
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'api_key') {
          requestUrl.searchParams.append(key, value.toString());
        }
      });
      console.log('Request URL (without API key):', requestUrl.toString());
      console.log('Full params:', { ...params, api_key: 'HIDDEN' });
      
      const response = await axios.get(BASE_URL, { params });
      console.log('API Response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: Object.keys(response.data || {}),
        searchInformation: response.data?.search_information,
        searchMetadata: response.data?.search_metadata,
        error: response.data?.error,
        searchParameters: response.data?.search_parameters
      });

      if (!response.data) {
        throw new Error('Empty response from API');
      }

      if (response.data.error) {
        console.error('API Error:', response.data.error);
        console.error('Search Parameters:', response.data.search_parameters);
        throw new Error(`API Error: ${response.data.error}`);
      }

      // Extract flights from the correct path in the response
      const flights = response.data.flights_data || 
                     response.data.best_flights?.oneway || 
                     response.data.other_flights?.oneway || 
                     response.data.flights_results || 
                     [];

      console.log('Found flights:', flights.length);
      console.log('First flight example:', flights[0]);

      if (!flights.length) {
        console.log('No flights found. Response data:', {
          searchInfo: response.data.search_information,
          errorInfo: response.data.error_info,
          searchParams: response.data.search_parameters,
          bestFlights: response.data.best_flights,
          otherFlights: response.data.other_flights,
          flightsResults: response.data.flights_results,
          flightsData: response.data.flights_data
        });
        throw new Error(`No flights found from ${departureCity} to ${arrivalCity} on ${outboundDate}. Try a different date or route.`);
      }

      // Transform the API response to match our interface
      return flights.map((flight: any) => ({
        price: parseFloat(String(flight.price?.total || flight.price).replace(/[^0-9.]/g, '') || '0'),
        airline: flight.airline || flight.carrier || 'Unknown Airline',
        flight_number: flight.flight_number || flight.flight || 'N/A',
        departure: {
          airport: flight.departure?.airport || 
                  flight.departure_airport || 
                  `${departureCity} (${departureCode})`,
          time: flight.departure?.time || 
                flight.departure_time || 
                'N/A'
        },
        arrival: {
          airport: flight.arrival?.airport || 
                  flight.arrival_airport || 
                  `${arrivalCity} (${arrivalCode})`,
          time: flight.arrival?.time || 
                flight.arrival_time || 
                'N/A'
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
      
      // Provide a more user-friendly error message
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(`Failed to search flights: ${errorMessage}`);
    }
  }
}

export const flightService = FlightService.getInstance(); 