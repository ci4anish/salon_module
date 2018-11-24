export interface SalonInfo {
  address: {
    city: string;
    country: {};
    line1: string;
    line2: boolean;
    line3: boolean;
    postCode: string;
    region: string;
    streetNameAndNumber: string;
  };
  admins: [{}];
  avatar: {};
  business: {};
  category: {};
  chairs: number;
  defaultLanguage: string;
  enabled: true;
  groups: [{}];
  id: number;
  longDescription: string;
  name: string;
  openHours: {
    id: number;
  };
  phone: {
    phone: string
  };
  professionalLinks: [{}];
  properties: {
    amenities: string[];
    dynamicLocationType: null;
    locationType: string;
    mainLanguage: string;
    otherLanguages: string[];
    paymentMethods: {
      method: string;
    }[];
    physicalLocationType: string;
  };
  reviews: [{}];
  schedule: [{}];
  serviceLinks: [{}];
  socialMediaLinks: [{}];
}
