export interface ReviewsInterface {
  averageAmbient: number;
  averageCleanliness: number;
  averageIntegrity: number;
  averageOverall: number;
  averageReliability: number;
  averageStaff: number;
  averageValueForMoney: number;
  reviews: [{
    appUser: {
      id: number;
    };
    content: string;
    date: string;
    enabled: boolean;
    expertise: number;
    id: number;
    integrity: number;
    location: {
      id: number;
    };
    privacyInfo: {
      id: number;
      visibleToAnonymous: boolean;
      visibleToRegistered: boolean;
      visibleToLocations: boolean;
      visibleToProfessionals: boolean;
    };
    ratingAmbient: number;
    ratingCleanliness: number;
    ratingOverall: number;
    ratingStaff: number;
    ratingValueForMoney: number;
    reliability: number;
    response: null;
    service: {
      id: number;
    };
    title: string;
    weight: number;
  }];
  totalNumberOfReviews: number;
}
