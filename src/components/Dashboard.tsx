import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Task } from '../lib/supabase';
import { LogOut, Plus, GraduationCap } from 'lucide-react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import FilterBar from './FilterBar';
import StatsCard from './StatsCard';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('due_date');

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, filterCategory, filterStatus, filterPriority, sortBy]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...tasks];

    if (filterCategory !== 'All') {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'All') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] -
                 priorityOrder[b.priority as keyof typeof priorityOrder];
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleTaskSaved = () => {
    fetchTasks();
    handleCloseForm();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      fetchTasks();
    } catch (error: any) {
      console.error('Error deleting task:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                <p className="text-sm text-gray-600">Welcome back!</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCard tasks={tasks} />

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
            <button
              onClick={handleCreateTask}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>

          <FilterBar
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <TaskList
            tasks={filteredTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onTaskUpdated={fetchTasks}
          />
        </div>
      </main>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
          onSave={handleTaskSaved}
        />
      )}
    </div>
  );
}
