import { Task } from '../lib/supabase';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  tasks: Task[];
}

export default function StatsCard({ tasks }: StatsCardProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

  const overdueTasks = tasks.filter(t => {
    if (t.status === 'Completed' || !t.due_date) return false;
    return new Date(t.due_date) < new Date();
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
          <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>
    </div>
  );
}
