interface Flight {
  airline: string;
  flight_number: string;
  price: number;
  departure: {
    airport: string;
    time: string;
    date?: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
}

interface Airport {
  city: string;
  code: string;
  name: string;
}

interface Route {
  from: Airport;
  to: Airport;
  distance: string;
  flightTime: string;
  airlines: string[];
  basePrice: number;
}

type MockFlights = {
  [key: string]: Flight[];
};

type Routes = {
  [key: string]: Route;
};

// Mock flight data for demonstration
export const MOCK_FLIGHTS: MockFlights = {
  'LHR-CDG': [
    {
      airline: "British Airways",
      flight_number: "BA346",
      price: 189,
      departure: {
        airport: "London Heathrow (LHR)",
        time: "07:30"
      },
      arrival: {
        airport: "Paris Charles de Gaulle (CDG)",
        time: "09:45"
      }
    },
    {
      airline: "Air France",
      flight_number: "AF1681",
      price: 165,
      departure: {
        airport: "London Heathrow (LHR)",
        time: "10:15"
      },
      arrival: {
        airport: "Paris Charles de Gaulle (CDG)",
        time: "12:30"
      }
    },
    {
      airline: "British Airways",
      flight_number: "BA352",
      price: 210,
      departure: {
        airport: "London Heathrow (LHR)",
        time: "14:45"
      },
      arrival: {
        airport: "Paris Charles de Gaulle (CDG)",
        time: "17:00"
      }
    },
    {
      airline: "Air France",
      flight_number: "AF1689",
      price: 178,
      departure: {
        airport: "London Heathrow (LHR)",
        time: "16:30"
      },
      arrival: {
        airport: "Paris Charles de Gaulle (CDG)",
        time: "18:45"
      }
    },
    {
      airline: "British Airways",
      flight_number: "BA358",
      price: 195,
      departure: {
        airport: "London Heathrow (LHR)",
        time: "19:15"
      },
      arrival: {
        airport: "Paris Charles de Gaulle (CDG)",
        time: "21:30"
      }
    }
  ],
  'JFK-LAX': [
    {
      airline: "American Airlines",
      flight_number: "AA123",
      price: 399,
      departure: {
        airport: "New York JFK (JFK)",
        time: "08:00"
      },
      arrival: {
        airport: "Los Angeles (LAX)",
        time: "11:30"
      }
    },
    {
      airline: "Delta",
      flight_number: "DL456",
      price: 425,
      departure: {
        airport: "New York JFK (JFK)",
        time: "11:15"
      },
      arrival: {
        airport: "Los Angeles (LAX)",
        time: "14:45"
      }
    },
    {
      airline: "United Airlines",
      flight_number: "UA789",
      price: 385,
      departure: {
        airport: "New York JFK (JFK)",
        time: "14:30"
      },
      arrival: {
        airport: "Los Angeles (LAX)",
        time: "18:00"
      }
    },
    {
      airline: "American Airlines",
      flight_number: "AA125",
      price: 445,
      departure: {
        airport: "New York JFK (JFK)",
        time: "16:45"
      },
      arrival: {
        airport: "Los Angeles (LAX)",
        time: "20:15"
      }
    },
    {
      airline: "Delta",
      flight_number: "DL458",
      price: 375,
      departure: {
        airport: "New York JFK (JFK)",
        time: "20:00"
      },
      arrival: {
        airport: "Los Angeles (LAX)",
        time: "23:30"
      }
    }
  ],
  'DXB-SIN': [
    {
      airline: "Emirates",
      flight_number: "EK354",
      price: 750,
      departure: {
        airport: "Dubai International (DXB)",
        time: "03:15"
      },
      arrival: {
        airport: "Singapore Changi (SIN)",
        time: "14:45"
      }
    },
    {
      airline: "Singapore Airlines",
      flight_number: "SQ495",
      price: 785,
      departure: {
        airport: "Dubai International (DXB)",
        time: "09:30"
      },
      arrival: {
        airport: "Singapore Changi (SIN)",
        time: "21:15"
      }
    }
  ]
};

// Price variations for different dates
export const generatePriceVariation = (basePrice: number, date: Date): number => {
  // Generate a predictable but varying price based on the date
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  
  // Weekend prices are higher
  const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1;
  
  // Prices vary throughout the month (higher in middle of month)
  const monthMultiplier = 1 + Math.sin((dayOfMonth / 31) * Math.PI) * 0.15;
  
  // Add some randomness
  const randomVariation = 0.9 + (Math.sin(dayOfMonth * dayOfWeek) * 0.2);
  
  return Math.round(basePrice * weekendMultiplier * monthMultiplier * randomVariation);
};

// Common city pairs with their details
export const POPULAR_ROUTES: Routes = {
  'London-Paris': {
    from: {
      city: 'London',
      code: 'LHR',
      name: 'Heathrow Airport'
    },
    to: {
      city: 'Paris',
      code: 'CDG',
      name: 'Charles de Gaulle Airport'
    },
    distance: '344 km',
    flightTime: '1h 15m',
    airlines: ['British Airways', 'Air France', 'EasyJet'],
    basePrice: 150
  },
  'New York-Los Angeles': {
    from: {
      city: 'New York',
      code: 'JFK',
      name: 'John F. Kennedy International'
    },
    to: {
      city: 'Los Angeles',
      code: 'LAX',
      name: 'Los Angeles International'
    },
    distance: '3,935 km',
    flightTime: '6h 30m',
    airlines: ['American Airlines', 'Delta', 'United'],
    basePrice: 350
  },
  'Dubai-Singapore': {
    from: {
      city: 'Dubai',
      code: 'DXB',
      name: 'Dubai International'
    },
    to: {
      city: 'Singapore',
      code: 'SIN',
      name: 'Changi Airport'
    },
    distance: '5,841 km',
    flightTime: '7h 45m',
    airlines: ['Emirates', 'Singapore Airlines'],
    basePrice: 700
  }
};

// Helper function to get route key
export const getRouteKey = (from: string, to: string): string => {
  const route = POPULAR_ROUTES[`${from}-${to}`];
  return route ? `${route.from.code}-${route.to.code}` : `${from}-${to}`;
};

// Generate mock flights for a specific date
export const generateFlightsForDate = (from: string, to: string, date: Date): Flight[] => {
  const routeKey = getRouteKey(from, to);
  const baseFlights = MOCK_FLIGHTS[routeKey] || [];
  
  return baseFlights.map(flight => ({
    ...flight,
    price: generatePriceVariation(flight.price, date),
    departure: {
      ...flight.departure,
      date: date.toISOString().split('T')[0]
    }
  }));
};

interface PriceHistory {
  date: string;
  price: number;
}

// Get price history for a route
export const generatePriceHistory = (from: string, to: string, days: number = 30): PriceHistory[] => {
  const routeKey = getRouteKey(from, to);
  const basePrice = MOCK_FLIGHTS[routeKey]?.[0]?.price || 200;
  const history: PriceHistory[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      price: generatePriceVariation(basePrice, date)
    });
  }
  
  return history.reverse();
}; 