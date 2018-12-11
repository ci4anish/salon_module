export interface Service {
  id: number;
  location: {
    id: number;
  };
  professionals: {}[];
  service: {
    basePrice: number;
    description: string;
    enabled: boolean;
    gender: string;
    group: {
      id: number;
    };
    id: number;
    images: boolean;
    locationLinks: {}[];
    minimumMinutes: number;
    minutes: number;
    name: string;
    pricingStrategy: {
      servicePricingType: string;
    };
    properties: {
      serviceClass: string;
      serviceType: null;
    };
    timesHasBeenBooked: number;
    type: string;
    videos: boolean;
  };
  serviceNature: string;
  serviceOrder: number;
}
