// Flight Search API Integration Example

// 1. API Configuration
const API_CONFIG = {
  baseUrl: 'https://your-flight-api.com',
  apiKey: process.env.FLIGHT_API_KEY,
  headers: {
    'Authorization': `Bearer ${process.env.FLIGHT_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

// 2. Flight Search Function
const searchFlights = async (params: {
  origin: string;
  destination: string;
  date?: string;
}) => {
  try {
    const response = await axios.get(`${API_CONFIG.baseUrl}/flights/search`, {
      headers: API_CONFIG.headers,
      params: {
        departure_airport: params.origin,
        arrival_airport: params.destination,
        date: params.date,
        currency: 'USD'
      }
    });

    // Transform API response to match our interface
    return response.data.flights.map((flight: any) => ({
      airline: flight.airline_name,
      flight_number: flight.flight_number,
      price: flight.price_usd,
      departure: {
        airport: flight.departure.airport_name,
        time: flight.departure.time
      },
      arrival: {
        airport: flight.arrival.airport_name,
        time: flight.arrival.time
      }
    }));
  } catch (error) {
    console.error('Flight search error:', error);
    throw error;
  }
};

// 3. Price Calendar Function
const getPriceCalendar = async (params: {
  origin: string;
  destination: string;
  startDate: string;
}) => {
  try {
    const response = await axios.get(`${API_CONFIG.baseUrl}/prices/calendar`, {
      headers: API_CONFIG.headers,
      params: {
        from: params.origin,
        to: params.destination,
        start_date: params.startDate,
        duration: 30 // days to check
      }
    });

    return response.data.prices.map((day: any) => ({
      date: day.date,
      price: day.lowest_price,
      available: day.has_flights
    }));
  } catch (error) {
    console.error('Price calendar error:', error);
    throw error;
  }
};

// 4. Usage in component
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  setHasSearched(true);
  
  try {
    const flights = await searchFlights({
      origin,
      destination,
      date: selectedDate ? formatDate(selectedDate) : undefined
    });

    if (flights.length > 0) {
      setSearchResults(flights);
      toast.success(`Found ${flights.length} flights!`);
      
      // Load price calendar
      const calendar = await getPriceCalendar({
        origin,
        destination,
        startDate: formatDate(new Date())
      });
      setPriceDates(calendar);
    } else {
      setSearchResults([]);
    }
  } catch (error: any) {
    console.error("Search error:", error);
    toast.error("Failed to search flights");
    setSearchResults([]);
  } finally {
    setIsSubmitting(false);
  }
};