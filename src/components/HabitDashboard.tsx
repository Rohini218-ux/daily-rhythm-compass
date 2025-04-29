
import React, { useState, useEffect } from "react";
import { Habit, TimeOfDay } from "@/types/habit";
import HabitItem from "./HabitItem";
import AddHabitForm from "./AddHabitForm";
import ProgressBar from "./ProgressBar";
import { 
  initializeHabits, 
  saveHabits, 
  getDayProgress, 
  groupHabitsByTimeOfDay, 
  resetDailyHabits,
  isNewDay 
} from "@/utils/habitUtils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const HabitDashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeTimeOfDay, setActiveTimeOfDay] = useState<TimeOfDay>("morning");
  const { toast } = useToast();

  // On mount, initialize habits
  useEffect(() => {
    // Check if it's a new day and reset habits if necessary
    if (isNewDay()) {
      const storedHabits = initializeHabits();
      const resetHabits = resetDailyHabits(storedHabits);
      setHabits(resetHabits);
      saveHabits(resetHabits);
      toast({
        title: "Good morning!",
        description: "Your habits have been reset for a new day.",
      });
    } else {
      setHabits(initializeHabits());
    }

    // Set active time of day based on current time
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setActiveTimeOfDay("morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setActiveTimeOfDay("afternoon");
    } else {
      setActiveTimeOfDay("evening");
    }
  }, [toast]);

  // Save habits whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      saveHabits(habits);
    }
  }, [habits]);

  const handleAddHabit = (newHabit: Habit) => {
    setHabits((prev) => [...prev, newHabit]);
    toast({
      title: "Habit added",
      description: `${newHabit.title} has been added to your habits.`,
    });
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
    setEditingHabit(null);
    toast({
      title: "Habit updated",
      description: `${updatedHabit.title} has been updated.`,
    });
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    toast({
      title: "Habit deleted",
      description: "The habit has been deleted.",
      variant: "destructive",
    });
  };

  const handleToggleComplete = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, notes } : habit))
    );
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleCancelEdit = () => {
    setEditingHabit(null);
  };

  const progress = getDayProgress(habits);
  const groupedHabits = groupHabitsByTimeOfDay(habits);

  const timeOfDayLabels: Record<TimeOfDay, string> = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">Daily Rhythm Compass</h1>
          <p className="text-muted-foreground">Track and complete your daily habits</p>
        </div>
        <AddHabitForm
          onAddHabit={handleAddHabit}
          editingHabit={editingHabit}
          onUpdateHabit={handleUpdateHabit}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">Daily Progress</h2>
          <span className="text-sm text-muted-foreground font-medium">
            {progress}% Complete
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="flex overflow-x-auto mb-6 pb-2 gap-2">
        {Object.keys(timeOfDayLabels).map((key) => (
          <Button
            key={key}
            variant={activeTimeOfDay === key ? "default" : "outline"}
            onClick={() => setActiveTimeOfDay(key as TimeOfDay)}
            className={`min-w-24 ${
              activeTimeOfDay === key
                ? "bg-habit-primary hover:bg-habit-dark"
                : ""
            }`}
          >
            {timeOfDayLabels[key as TimeOfDay]}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium mb-4">
          {timeOfDayLabels[activeTimeOfDay]} Habits
        </h3>
        
        {groupedHabits[activeTimeOfDay].length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">
              No habits for {timeOfDayLabels[activeTimeOfDay].toLowerCase()} yet.
            </p>
            <Button
              onClick={() => {
                // Open the add habit dialog
                const addButton = document.querySelector('[aria-label="Add Habit"]');
                if (addButton instanceof HTMLElement) {
                  addButton.click();
                }
              }}
              variant="link"
              className="mt-2"
            >
              Add one now
            </Button>
          </div>
        ) : (
          groupedHabits[activeTimeOfDay].map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggleComplete={handleToggleComplete}
              onUpdateNotes={handleUpdateNotes}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
            />
          ))
        )}
      </div>
      
      <Separator className="my-8" />
      
      <div className="text-sm text-center text-muted-foreground">
        <p>
          Your data is saved locally on this device.
        </p>
      </div>
    </div>
  );
};

export default HabitDashboard;
