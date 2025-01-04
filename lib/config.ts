const config = {
  serpApi: {
    apiKey: process.env.NEXT_PUBLIC_FLIGHT_API_KEY || process.env.FLIGHT_API_KEY,
    baseUrl: 'https://serpapi.com/search'
  }
};

export default config; 