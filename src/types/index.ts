// Type definitions for the application

export interface TramSchedule {
  stopId: string;
  arrivals: Array<{
    time: string;
    destination: string;
    tramNumber: string;
  }>;
}

export interface TramStop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}