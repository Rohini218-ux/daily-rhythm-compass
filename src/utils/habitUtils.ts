
import { Habit, TimeOfDay } from "../types/habit";

// Default habits
const defaultHabits: Habit[] = [
  {
    id: "1",
    title: "Wake up",
    startTime: "06:00",
    endTime: "06:15",
    completed: false,
    notes: "",
    isDefault: true,
  },
  {
    id: "2",
    title: "Brush teeth",
    startTime: "06:15",
    endTime: "06:30",
    completed: false,
    notes: "",
    isDefault: true,
  },
  {
    id: "3",
    title: "Exercise",
    startTime: "06:30",
    endTime: "07:30",
    completed: false,
    notes: "",
    isDefault: true,
  },
  {
    id: "4",
    title: "Breakfast",
    startTime: "07:30",
    endTime: "08:00",
    completed: false,
    notes: "",
    isDefault: true,
  },
  {
    id: "5",
    title: "Work",
    startTime: "09:00",
    endTime: "12:00",
    completed: false,
    notes: "",
    isDefault: true,
  },
  {
    id: "6",
    title: "Lunch",
    startTime: "12:00",
    endTime: "13:00",
    completed: false,
    notes: "",
    isDefault: true,
  },
  {
    id: "7",
    title: "Work",
    startTime: "13:00",
    endTime: "17:00",
    completed: false,
    notes: "",
    isDefault: true,
  },
  {
    id: "8",
    title: "Relax",
    startTime: "18:00",
    endTime: "21:00",
    completed: false,
    notes: "",
    isDefault: true,
  },
  {
    id: "9",
    title: "Sleep",
    startTime: "22:00",
    endTime: "06:00",
    completed: false,
    notes: "",
    isDefault: true,
  },
];

// Initialize habits from localStorage or use defaults
export const initializeHabits = (): Habit[] => {
  const storedHabits = localStorage.getItem("habits");
  if (storedHabits) {
    return JSON.parse(storedHabits);
  }
  return defaultHabits;
};

// Save habits to localStorage
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem("habits", JSON.stringify(habits));
};

// Get the day progress percentage
export const getDayProgress = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;
  const completedCount = habits.filter((habit) => habit.completed).length;
  return Math.round((completedCount / habits.length) * 100);
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Format time (24h -> 12h)
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Categorize habit by time of day
export const getTimeOfDay = (startTime: string): TimeOfDay => {
  const hour = parseInt(startTime.split(":")[0], 10);
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
};

// Group habits by time of day
export const groupHabitsByTimeOfDay = (habits: Habit[]): Record<TimeOfDay, Habit[]> => {
  const grouped: Record<TimeOfDay, Habit[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  habits.forEach((habit) => {
    const timeOfDay = getTimeOfDay(habit.startTime);
    grouped[timeOfDay].push(habit);
  });

  // Sort habits within each group by start time
  Object.keys(grouped).forEach((key) => {
    grouped[key as TimeOfDay].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });

  return grouped;
};

// Reset habits for a new day
export const resetDailyHabits = (habits: Habit[]): Habit[] => {
  return habits.map((habit) => ({
    ...habit,
    completed: false,
    notes: "",
  }));
};

// Check if it's a new day
export const isNewDay = (): boolean => {
  const lastCheckedDate = localStorage.getItem("lastCheckedDate");
  const currentDate = new Date().toDateString();
  
  if (lastCheckedDate !== currentDate) {
    localStorage.setItem("lastCheckedDate", currentDate);
    return true;
  }
  
  return false;
};
