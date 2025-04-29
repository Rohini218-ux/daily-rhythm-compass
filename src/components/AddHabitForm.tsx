
import React, { useEffect, useState } from "react";
import { Habit } from "@/types/habit";
import { generateId } from "@/utils/habitUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddHabitFormProps {
  onAddHabit: (habit: Habit) => void;
  editingHabit: Habit | null;
  onUpdateHabit: (habit: Habit) => void;
  onCancelEdit: () => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({
  onAddHabit,
  editingHabit,
  onUpdateHabit,
  onCancelEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Habit, "id" | "completed">>({
    title: "",
    startTime: "08:00",
    endTime: "09:00",
    notes: "",
  });

  useEffect(() => {
    if (editingHabit) {
      setFormData({
        title: editingHabit.title,
        startTime: editingHabit.startTime,
        endTime: editingHabit.endTime,
        notes: editingHabit.notes,
      });
      setIsOpen(true);
    }
  }, [editingHabit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    if (editingHabit) {
      onUpdateHabit({
        ...editingHabit,
        ...formData,
      });
    } else {
      const newHabit: Habit = {
        id: generateId(),
        title: formData.title,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes,
        completed: false,
      };
      onAddHabit(newHabit);
    }

    // Reset form
    setFormData({
      title: "",
      startTime: "08:00",
      endTime: "09:00",
      notes: "",
    });
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && editingHabit) {
      onCancelEdit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="group flex items-center gap-1 bg-habit-primary hover:bg-habit-dark">
          <Plus className="h-4 w-4" />
          <span>Add Habit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingHabit ? "Edit Habit" : "Add New Habit"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Habit Name</Label>
            <Input
              id="title"
              name="title"
              placeholder="What habit do you want to track?"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              name="notes"
              placeholder="Any additional details..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-habit-primary hover:bg-habit-dark">
              {editingHabit ? "Update Habit" : "Add Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitForm;
