import { useState } from 'react';
import { TramStop } from '../types';

export const useStopSelection = () => {
  const [selectedStop, setSelectedStop] = useState<TramStop | null>(null);
  const [nearbyStops, setNearbyStops] = useState<TramStop[]>([]);

  const selectStop = (stop: TramStop) => {
    setSelectedStop(stop);
  };

  const updateNearbyStops = (stops: TramStop[]) => {
    setNearbyStops(stops);
  };

  return {
    selectedStop,
    nearbyStops,
    selectStop,
    updateNearbyStops
  };
};