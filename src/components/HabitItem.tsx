
import React, { useState } from "react";
import { Habit } from "@/types/habit";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatTime } from "@/utils/habitUtils";
import { cn } from "@/lib/utils";

interface HabitItemProps {
  habit: Habit;
  onToggleComplete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onToggleComplete,
  onUpdateNotes,
  onEdit,
  onDelete,
}) => {
  const [showNotes, setShowNotes] = useState(false);

  const timeDisplay = `${formatTime(habit.startTime)} - ${formatTime(habit.endTime)}`;

  return (
    <div
      className={cn(
        "habit-item",
        habit.completed ? "habit-item-completed" : "habit-item-pending"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="habit-time">{timeDisplay}</div>
          <h3 className="habit-title">{habit.title}</h3>
          {habit.notes && !showNotes && (
            <p className="habit-notes line-clamp-1">{habit.notes}</p>
          )}
        </div>
        <div className="flex items-center">
          <Checkbox
            checked={habit.completed}
            onCheckedChange={() => onToggleComplete(habit.id)}
            className="mr-2 h-6 w-6"
            aria-label={`Mark ${habit.title} as ${habit.completed ? 'incomplete' : 'complete'}`}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNotes(!showNotes)}
          className="text-xs"
        >
          {showNotes ? "Hide Notes" : habit.notes ? "Edit Notes" : "Add Notes"}
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(habit)}
            className="text-xs"
          >
            Edit
          </Button>
          {!habit.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(habit.id)}
              className="text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {showNotes && (
        <div className="mt-3 animate-fade-in">
          <Textarea
            value={habit.notes}
            onChange={(e) => onUpdateNotes(habit.id, e.target.value)}
            placeholder="Add notes about this habit..."
            className="w-full resize-none"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default HabitItem;
