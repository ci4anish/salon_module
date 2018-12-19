export interface WeekTime {
  id: number;
  weekTimeFrame: {
    timeFrame: {
      startTimeMS: number;
      endTimeMS: number;
    },
    weekDay: string;
  };
}
