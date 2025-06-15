import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TaskFormProps {
  editingTask: Task | null;
  onCreate: (title: string, description: string) => void;
  onUpdate: (task: Task) => void;
  onCancelEdit: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ editingTask, onCreate, onUpdate, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setIsFormDialogOpen(true);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      onUpdate({ ...editingTask, title, description });
    } else {
      onCreate(title, description);
    }
    setIsFormDialogOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleCancel = () => {
    onCancelEdit();
    setTitle('');
    setDescription('');
  };

  return (
    <Dialog open={isFormDialogOpen}
      onOpenChange={(open) => {
        setIsFormDialogOpen(open);
        if (!open) {
          onCancelEdit();
        }
      }}
    >

      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              Create new taks
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-3 mt-5">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required />
          </div>
          <div className="grid w-full gap-3 mt-5">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea placeholder="Description" className='resize-none h-24'
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter className='mt-5'>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={handleCancel}
              >Cancel</Button>
            </DialogClose>
            <Button type='submit'>{editingTask ? 'Update Task' : 'Add Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm; 