export interface Professional {
  id: number;
  location: { id: number };
  numberOfServices: number;
  policy: { id: number };
  professional: {
    avatar: { id: number , url: string};
    enabled: boolean;
    groups: [{}];
    id: number;
    locationLinks: [{}];
    properties: {
      acceptsHireRequests: boolean;
      defaultCommissionPercentage: number;
      takesAppointments: true;
      professionalEmploymentType: string;
      staffColour: string;
    };
    reviews: [{}];
    schedule: { id: number };
    serviceLinks: [{}];
    socialMediaLinks: [{}];
    user: {
      username: string;
      userClass: string;
      validated: boolean;
      acceptsNewsletter: boolean;
      id: number;
      person: {
        firstName: string;
      }
    };
    vouchers: [{}];
    professionalWorkType: string;
  };
  professionalWorkType: string;
}
