import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MOCK_FLIGHTS } from '@/lib/services/mock-flight-data';
import { Home } from 'lucide-react';
import Link from 'next/link';

interface NoFlightsFoundProps {
  onRouteSelect: (origin: string, destination: string) => void;
}

export function NoFlightsFound({ onRouteSelect }: NoFlightsFoundProps) {
  // Define some hardcoded popular routes if MOCK_FLIGHTS is empty
  const defaultRoutes = ['LHR-CDG', 'JFK-LAX', 'LHR-JFK', 'DXB-SIN'];
  
  const popularRoutes = Object.keys(MOCK_FLIGHTS).length > 0 
    ? Object.keys(MOCK_FLIGHTS)
    : defaultRoutes;

  return (
    <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-3">No flights found for this route</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Try one of our popular routes:
      </p>
      <div className="flex flex-wrap gap-2">
        {popularRoutes.map((route) => (
          <Button
            key={route}
            variant="outline"
            size="sm"
            onClick={() => {
              const [origin, destination] = route.split('-');
              onRouteSelect(origin, destination);
            }}
          >
            {route}
          </Button>
        ))}
      </div>
    </Card>
  );
} 