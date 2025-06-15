import React from 'react';
import type { Task } from '../types';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FaCheckCircle, FaPencilAlt, FaRegCircle, FaTrashAlt } from 'react-icons/fa';
import { ScrollArea } from "@/components/ui/scroll-area"

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  return (
    <ScrollArea className="h-full w-full rounded-md border">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-5">
        {
          tasks.length === 0 ? (
            <p className="text-gray-600">No tasks yet. Create one above!</p>
          ) : (
            tasks.map((task) => (
              <Card>
                <CardHeader>
                  <CardTitle className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.title}</CardTitle>
                  <CardDescription>
                    <p className="text-xs text-gray-400">Created: {new Date(task.createdAt).toLocaleString()}</p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {task.description}
                </CardContent>
                <CardFooter className='flex gap-2 justify-end'>
                  <Button
                    className={`${task.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                    onClick={() => onToggleComplete(task)}
                  >
                    {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
                  </Button>
                  <Button
                    className='bg-yellow-500 hover:bg-yellow-600'
                    onClick={() => onEdit(task)}
                  >
                    <FaPencilAlt />
                  </Button>
                  <Button
                    className='bg-red-500 hover:bg-red-600'
                    onClick={() => onDelete(task.id)}
                  >
                    <FaTrashAlt />
                  </Button>
                </CardFooter>
              </Card>
            )))
        }
      </div>
    </ScrollArea>
  )
};

export default TaskList; 