export interface AvailableHours {
  id: number;
  weekTimeFrame: [{
    targetDay?: boolean;
    closeDay?:  boolean;
    weekDay: string;
    timeFrame: {
      endTimeMS: string;
      startTimeMS: string;
    }
  }];
}
