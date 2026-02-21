import { Filter, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export default function FilterBar({
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy
}: FilterBarProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters & Sort</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="All">All Categories</option>
            <option value="Assignment">Assignment</option>
            <option value="Project">Project</option>
            <option value="Exam">Exam</option>
            <option value="Personal Study">Personal Study</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            <ArrowUpDown className="w-3 h-3 inline mr-1" />
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created">Recently Created</option>
          </select>
        </div>
      </div>
    </div>
  );
}
