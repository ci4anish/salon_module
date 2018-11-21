
export interface SalonInfoInterface {
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
  openHours: {};
  phone: {
    phone: string
  };
  professionalLinks: [{}];
  properties: {
    dynamicLocationType: null;
    locationType: string;
    paymentMethods: [{
      method: string;
    }];
    physicalLocationType: string;
  };
  reviews: [{}];
  schedule: [{}];
  serviceLinks: [{}];
  socialMediaLinks: [{}];
}
