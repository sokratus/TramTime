import React from 'react';
import { TramSchedule } from '../types';

interface TimeDisplayProps {
  schedule: TramSchedule | null;
  isLoading: boolean;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ schedule, isLoading }) => {
  if (isLoading) {
    return <div className="text-gray-600">Loading schedule...</div>;
  }

  if (!schedule || schedule.arrivals.length === 0) {
    return <div className="text-gray-600">No upcoming trams</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upcoming Trams</h2>
      <div className="space-y-2">
        {schedule.arrivals.map((arrival, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-soft hover:shadow-hover">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-medium">Tram {arrival.tramNumber}</span>
                <p className="text-gray-600">{arrival.destination}</p>
              </div>
              <div className="text-right">
                <time className="text-lg text-primary-dark">{arrival.time}</time>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};