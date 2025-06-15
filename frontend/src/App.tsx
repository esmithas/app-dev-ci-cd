import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import type { Task } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks in App component:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (title: string, description: string) => {
    try {
      const newTask = await createTask(title, description);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error creating task in App component:', error);
    }
  };

  const handleUpdateTask = async (taskToUpdate: Task) => {
    try {
      const updatedTask = await updateTask(taskToUpdate);
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task in App component:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task in App component:', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await updateTask({ ...task, completed: !task.completed });
      setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error toggling complete status in App component:', error);
    }
  };

  return (
    <div className="w-full h-full max-h-screen p-16 flex">
      <div className='w-3/4'>
        <h1 className="text-5xl">Task Manager</h1>

      </div>
      <div className='w-1/4'>
        <div className='flex justify-between'>
          <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>
          {/* Formulario de Tareas */}
          <TaskForm
            editingTask={editingTask}
            onCreate={handleCreateTask}
            onUpdate={handleUpdateTask}
            onCancelEdit={handleCancelEdit}
          />

        </div>

        {/* Lista de Tareas */}
        <TaskList
          tasks={tasks}
          onEdit={startEditing}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
}

export default App;
