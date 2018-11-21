export interface AvailableHours {
  id: number;
  weekTimeFrame: [{
    targetDay?: boolean;
    weekDay: string;
    timeFrame: {
      endTimeMS: number;
      startTimeMS: number;
    }
  }];
}
