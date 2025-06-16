import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import type { Task } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';
import TaskCompletionPieChart from './components/charts/TaskCompletionPieChart';
import MonthlyTasksBarChart from './components/charts/MonthlyTasksBarChart';
import { ChartRadialStacked } from './components/charts/ChartRadialStacked';
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

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.filter(task => !task.completed).length;

  const pieChartData = [
    { name: 'completed', value: completedTasksCount, fill: 'var(--chart-2)' },
    { name: 'pending', value: pendingTasksCount, fill: 'var(--chart-4)' }, 
  ];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const tasksCurrentMonth = tasks.filter(task => {
    const taskDate = new Date(task.updatedAt);
    return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
  });

  const completedTasksCurrentMonth = tasksCurrentMonth.filter(task => task.completed).length;
  const pendingTasksCurrentMonth = tasksCurrentMonth.filter(task => !task.completed).length;

  const getDailyCompletedTasksData = (allTasks: Task[]) => {
    const dailyCounts: { [key: string]: number } = {};
    const now = new Date();

    for (let i = 15; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const yearMonthDay = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      dailyCounts[yearMonthDay] = 0;
    }

    allTasks.forEach(task => {
      if (task.completed) {
        const date = new Date(task.updatedAt);
        const yearMonthDay = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        if (dailyCounts.hasOwnProperty(yearMonthDay)) {
          dailyCounts[yearMonthDay] = (dailyCounts[yearMonthDay] || 0) + 1;
        }
      }
    });

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
      label: "Tasks completed",
      theme: {
        light: "var(--chart-2)",
        dark: "var(--chart-2)",
      },
    },
    completed: {
      label: "Completed",
      theme: {
        light: "var(--chart-2)",
        dark: "var(--chart-2)",
      },
    },
    pending: {
      label: "Pending",
      theme: {
        light: "var(--chart-4)",
        dark: "var(--chart-4)",
      },
    },
    totalTasks: {
      label: "Total Tasks",
      theme: {
        light: "var(--chart-2)",
        dark: "var(--chart-2)",
      },
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 flex justify-center items-center">
      <div className='container flex flex-col-reverse lg:flex-row gap-5 bg-stone-200 p-4 sm:p-6 md:p-8 rounded-2xl'>
        <div className='w-full lg:w-3/4'>
          <h1 className="text-3xl">Task Manager</h1>
          <div className="flex flex-col gap-5 mt-5">
            <div className='w-full '>
              <MonthlyTasksBarChart data={barChartData} chartConfig={chartConfig} />
            </div>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-5'>
              <TaskCompletionPieChart data={pieChartData} chartConfig={chartConfig} />
              <ChartRadialStacked 
                completedTasks={completedTasksCurrentMonth}
                pendingTasks={pendingTasksCurrentMonth}
              />
            </div>
          </div>
        </div>
        <div className='w-full lg:w-1/4 max-h-[750px]'>
          <div className='flex justify-between'>
            <h2 className="text-2xl mb-4">My Tasks</h2>
            <TaskForm
              editingTask={editingTask}
              onCreate={handleCreateTask}
              onUpdate={handleUpdateTask}
              onCancelEdit={handleCancelEdit}
            />
          </div>
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
