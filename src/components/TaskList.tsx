import { Task } from '../lib/supabase';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskUpdated: () => void;
}

export default function TaskList({ tasks, onEditTask, onDeleteTask, onTaskUpdated }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <span className="text-3xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onUpdate={onTaskUpdated}
        />
      ))}
    </div>
  );
}
