const config = {
  serpApi: {
    apiKey: process.env.NEXT_PUBLIC_FLIGHT_API_KEY,
    baseUrl: 'https://serpapi.com/search'
  }
};

if (!config.serpApi.apiKey) {
  console.warn('Warning: NEXT_PUBLIC_FLIGHT_API_KEY is not set in environment variables');
}

export default config; 