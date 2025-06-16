import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import type { Task } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';
// Importaciones para los componentes de gráficos (aún no creados, pero se importarán aquí)
import TaskCompletionPieChart from './components/charts/TaskCompletionPieChart';
import MonthlyTasksBarChart from './components/charts/MonthlyTasksBarChart';
import type { ChartConfig } from './components/ui/chart';

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

  // --- Lógica para preparar los datos de los gráficos --- //

  // Gráfico Circular: Tareas Completadas vs. Pendientes
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.filter(task => !task.completed).length;

  const pieChartData = [
    { name: 'completed', value: completedTasksCount, fill: 'var(--chart-2)' }, // Verde
    { name: 'pending', value: pendingTasksCount, fill: 'var(--chart-4)' },   // Naranja
  ];

  // Gráfico de Barras: Tareas Completadas por Día
  const getDailyCompletedTasksData = (allTasks: Task[]) => {
    const dailyCounts: { [key: string]: number } = {}; // { "YYYY-MM-DD": count }
    const now = new Date();

    // Initialize counts for the last 7 days
    for (let i = 15; i >= 0; i--) { // Last 7 days including today
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const yearMonthDay = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      dailyCounts[yearMonthDay] = 0;
    }

    allTasks.forEach(task => {
      if (task.completed) {
        const date = new Date(task.updatedAt); // Asumimos updatedAt es la fecha de finalización
        const yearMonthDay = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        if (dailyCounts.hasOwnProperty(yearMonthDay)) {
          dailyCounts[yearMonthDay] = (dailyCounts[yearMonthDay] || 0) + 1;
        }
      }
    });

    // Convertir a un array de objetos para Recharts, ordenado por fecha
    const formattedData = Object.keys(dailyCounts)
      .sort()
      .map(dateKey => {
        const date = new Date(dateKey);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const formattedDate = `${dayNames[date.getDay()]} ${date.getDate()}`;
        return { date: formattedDate, count: dailyCounts[dateKey] };
      });

    return formattedData;
  };

  const barChartData = getDailyCompletedTasksData(tasks);

  const chartConfig = {
    count: {
      label: "Tasks",
      theme: {
        light: "oklch(0.646 0.222 41.116)", // --chart-1 for light theme
        dark: "oklch(0.488 0.243 264.376)",  // --chart-1 for dark theme
      },
    },
    completed: {
      label: "Completed",
      theme: {
        light: "oklch(0.6 0.118 184.704)", // --chart-2 for light theme
        dark: "oklch(0.696 0.17 162.48)",  // --chart-2 for dark theme
      },
    },
    pending: {
      label: "Pending",
      theme: {
        light: "oklch(0.398 0.07 227.392)", // --chart-3 for light theme
        dark: "oklch(0.769 0.188 70.08)",  // --chart-3 for dark theme
      },
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full max-h-screen h-screen px-20 py-10 flex justify-center items-center">
      <div className='container flex gap-5 bg-gray-200 px-16 py-10 rounded-2xl'>
        <div className='w-3/4'>
          <h1 className="text-3xl">Task Manager</h1>
          {/* Sección de Gráficos */}
          <div className="flex flex-col gap-5 mt-5">
            <div className='w-full '>
              <MonthlyTasksBarChart data={barChartData} chartConfig={chartConfig} />
            </div>
            <div className='w-full grid grid-cols-2 gap-5'>
              <TaskCompletionPieChart data={pieChartData} chartConfig={chartConfig} />
              <TaskCompletionPieChart data={pieChartData} chartConfig={chartConfig} />
            </div>
          </div>
        </div>
        <div className='w-1/4 max-h-[750px]'>
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

    </div>
  );
}

export default App;
