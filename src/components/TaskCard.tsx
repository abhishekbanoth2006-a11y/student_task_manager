import { Task, supabase } from '../lib/supabase';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdate: () => void;
}

export default function TaskCard({ task, onEdit, onDelete, onUpdate }: TaskCardProps) {
  const [updating, setUpdating] = useState(false);

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed';

  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200'
  };

  const statusColors = {
    Pending: 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700'
  };

  const categoryIcons: Record<string, string> = {
    Assignment: '📝',
    Project: '🚀',
    Exam: '📚',
    'Personal Study': '💡'
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(task.due_date);

  const handleStatusChange = async (newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setUpdating(true);
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'Completed' && task.status !== 'Completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (newStatus !== 'Completed' && task.completed_at) {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', task.id);

      if (error) throw error;
      onUpdate();
    } catch (error: any) {
      console.error('Error updating task:', error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`bg-white border-2 rounded-xl p-5 hover:shadow-md transition ${
      isOverdue ? 'border-red-200 bg-red-50/30' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <button
              onClick={() => handleStatusChange(
                task.status === 'Completed' ? 'Pending' : 'Completed'
              )}
              disabled={updating}
              className="mt-1 text-gray-400 hover:text-green-600 transition disabled:opacity-50"
            >
              {task.status === 'Completed' ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{categoryIcons[task.category]}</span>
                <h3 className={`text-lg font-semibold text-gray-900 ${
                  task.status === 'Completed' ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
              </div>

              {task.description && (
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                  {task.priority} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                  {task.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {task.category}
                </span>
                {task.subject && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {task.subject}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {task.start_date && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Start: {formatDate(task.start_date)}</span>
                  </div>
                )}
                {task.due_date && (
                  <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDate(task.due_date)}</span>
                    {daysUntilDue !== null && task.status !== 'Completed' && (
                      <span className={`ml-1 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                        ({daysUntilDue === 0 ? 'Today' :
                          daysUntilDue > 0 ? `${daysUntilDue}d left` : `${Math.abs(daysUntilDue)}d overdue`})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
