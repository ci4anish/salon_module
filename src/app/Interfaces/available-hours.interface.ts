export interface AvailableHours {
  id: number;
  weekTimeFrame: [{
    targetDay?: boolean;
    weekDay: string;
    timeFrame: {
      endTimeMS: string;
      startTimeMS: string;
    }
  }];
}
