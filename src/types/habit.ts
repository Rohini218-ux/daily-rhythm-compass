
export interface Habit {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  notes: string;
  isDefault?: boolean;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';
