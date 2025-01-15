# Flight Price Tracker Documentation

## Overview
This application is a flight price tracking system that allows users to:
1. Search for flights between cities
2. View flight prices across different dates
3. Set price alerts for specific routes
4. Track price changes over time

## Architecture

### Core Components

#### 1. Flight Service (`lib/services/flight-service.ts`)
The central service that handles all flight-related operations.

```typescript
// Example usage:
const flightService = FlightService.getInstance();
const flights = await flightService.searchFlights('london', 'paris');
```

Key features:
- Singleton pattern for consistent state
- City to airport code mapping
- Date handling and formatting
- API integration with SerpAPI Google Flights
- Price calendar functionality

#### 2. Flight Search Page (`app/flights/page.tsx`)
The main user interface for flight searches.

Components:
- Search form with:
  ```typescript
  // Form fields
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [targetPrice, setTargetPrice] = useState("");
  ```
- Price calendar
- Search results display
- Active alerts section

#### 3. API Routes

##### a. Flight Search API (`app/api/flights/search/route.ts`)
Handles flight search requests:
```typescript
// Example request
GET /api/flights/search?origin=london&destination=paris&date=2024-02-01
```

Response formats:
```typescript
// Success response
{
  success: true,
  flights: [
    {
      airline: "British Airways",
      price: 150,
      departure: { time: "10:00", airport: "LHR" },
      arrival: { time: "13:00", airport: "CDG" }
    }
  ]
}

// Error response
{
  error: "No flights found",
  details: "Error message"
}
```

##### b. Alerts API (`app/api/alerts/route.ts`)
Manages price alert creation and tracking:
```typescript
// Example request
POST /api/alerts
{
  origin: "london",
  destination: "paris",
  targetPrice: "200"
}
```

### Database Schema (`prisma/schema.prisma`)
```prisma
model flight_route {
  id           Int           @id @default(autoincrement())
  origin       String
  destination  String
  user_id      String
  price_alerts price_alert[]
  price_history price_history[]
}

model price_alert {
  id           Int          @id @default(autoincrement())
  route_id     Int
  target_price Float
  is_active    Boolean      @default(true)
}
```

## Key Features

### 1. Flight Search
- Supports both city names and airport codes
- Example:
  ```typescript
  // Search by city name
  searchFlights("london", "paris")
  
  // Search by airport code
  searchFlights("LHR", "CDG")
  ```

### 2. Price Calendar
- Shows prices for 30 days
- Updates in real-time
- Example response:
  ```typescript
  [
    {
      date: "2024-02-01",
      price: 150,
      available: true
    },
    {
      date: "2024-02-02",
      price: 0,
      available: false
    }
  ]
  ```

### 3. Price Alerts
- Set target prices for routes
- Tracks price changes
- Notifies when prices drop below target

## User Interface

### Search Form
```tsx
<form onSubmit={handleSubmit}>
  <Input
    placeholder="Enter departure city"
    value={origin}
    onChange={(e) => setOrigin(e.target.value)}
  />
  <Input
    placeholder="Enter arrival city"
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
  />
  <Input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  />
  <Input
    type="number"
    placeholder="Target Price"
    value={targetPrice}
    onChange={(e) => setTargetPrice(e.target.value)}
  />
  <Button type="submit">Search Flights</Button>
</form>
```

### Results Display
```tsx
{searchResults.map((flight) => (
  <div key={flight.id}>
    <p>{flight.airline}</p>
    <p>{flight.price}</p>
    <p>{flight.departure.time} - {flight.arrival.time}</p>
  </div>
))}
```

## API Integration

### SerpAPI Google Flights
```typescript
const params = {
  api_key: API_KEY,
  engine: 'google_flights',
  departure_id: departureCode,
  arrival_id: arrivalCode,
  outbound_date: date,
  currency: 'USD'
};

const response = await axios.get(BASE_URL, { params });
```

## Error Handling

### User-Friendly Errors
```typescript
try {
  // API calls
} catch (error) {
  throw new Error(`Failed to search flights: ${error.message}`);
}
```

### Validation
```typescript
const validateForm = () => {
  if (origin === destination) {
    toast.error("Origin and destination cannot be the same");
    return false;
  }
  // More validations...
};
```

## Date Handling

### Format Conversions
```typescript
// Internal date format (YYYY-MM-DD)
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Display format (DD/MM/YYYY)
const formatDisplayDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-GB').format(date);
};
```

## Future Improvements

1. **Real-time Updates**
   - WebSocket integration for live price updates
   - Push notifications for price alerts

2. **Advanced Search**
   - Multi-city routes
   - Round-trip searches
   - Flexible dates

3. **Price Analytics**
   - Historical price trends
   - Price prediction
   - Best time to book recommendations

4. **User Features**
   - User authentication
   - Saved searches
   - Email notifications
   - Mobile app integration 

## Upcoming Work

### API Integration Enhancement (Next Steps)
1. **Real Flight Data Integration**
   - Replace mock data with real flight data from SerpAPI
   - Implement proper location search using airport codes
   - Example API endpoint:
   ```typescript
   GET https://serpapi.com/search.json?
       engine=google_flights&
       departure_id=LHR&
       arrival_id=CDG&
       outbound_date=2024-02-05&
       currency=USD
   ```

2. **Location Search Implementation**
   - Add autocomplete for city/airport search
   - Support for:
     - City names (e.g., "London" → "LHR")
     - Airport codes (e.g., "LHR")
     - Multiple airports per city

3. **Expected Response Format**
   ```typescript
   {
     "flights_data": [
       {
         "airline": "British Airways",
         "flight_number": "BA123",
         "departure": {
           "airport": "London Heathrow (LHR)",
           "time": "10:00"
         },
         "arrival": {
           "airport": "Paris Charles de Gaulle (CDG)",
           "time": "12:30"
         },
         "price": {
           "amount": 150,
           "currency": "USD"
         }
       }
       // ... more flights
     ]
   }
   ```

4. **Required Changes**
   - Update `flight-service.ts` to handle real API responses
   - Implement proper error handling for API limits and failures
   - Add response caching to minimize API calls
   - Update UI to display additional flight information

### Current Limitations (To Be Addressed)
- Using mock data for flight searches
- Limited airport/city support
- No real-time price updates
- Basic error handling 