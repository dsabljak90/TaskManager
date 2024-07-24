import { useTask } from "@/providers/customContext";
import React, { useCallback, useEffect, useState } from "react";
import { PRIORITY_LABELS } from "@/utils/labels";

export const PRIORITY_COLORS: { [key: string]: string } = {
  Lowest: "bg-green-100",
  Low: "bg-green-200",
  Medium: "bg-yellow-100",
  High: "bg-yellow-200",
  Highest: "bg-red-100",
  default: "bg-gray-100",
};

const TaskList: React.FC = () => {
  const {
    tasks,
    isModalOpen,
    editedTask,
    handleUpdate,
    handleChange,
    handleTaskClick,
    handleSliderChange,
    handleModalClose,
    handleDelete,
    fetchTasks,
  } = useTask();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handlePriorityFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedPriority(e.target.value || null);
    },
    []
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesSearchQuery =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority
      ? task.priority === selectedPriority
      : true;
    return matchesSearchQuery && matchesPriority;
  });

  const getPriorityColor = useCallback((priority: string) => {
    return PRIORITY_COLORS[priority] || PRIORITY_COLORS.default;
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 m-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 p-1 text-center">Your Tasks</h2>
      <div className="mb-6 flex justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="ml-4">
          <select
            value={selectedPriority || ""}
            onChange={handlePriorityFilterChange}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">All Priorities</option>
            {PRIORITY_LABELS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`border border-gray-300 rounded-md p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition ${getPriorityColor(
              task.priority
            )} w-60 h-60 flex flex-col justify-between`}
            onClick={() => handleTaskClick(task)}
          >
            <h3 className="text-xl font-semibold mb-2 truncate">{task.name}</h3>
            <p className="text-gray-700 mb-2 flex-grow overflow-hidden text-ellipsis">
              {task.description}
            </p>
            <p className="text-gray-500 mb-2">Priority: {task.priority}</p>
            <p className="text-gray-500 text-sm">
              Created at: {new Date(task.createdAt).toLocaleDateString()}
              <br />
              Updated at: {new Date(task.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {isModalOpen && editedTask && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
            <h2 className="text-3xl font-bold mb-4">Details</h2>
            <p className="font-bold mb-5 text-blue-500">
              Click on the field to edit
            </p>
            <form
              onSubmit={handleUpdate}
              className="space-y-4 bg-gray-100 p-4 rounded-lg"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={editedTask.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                  <textarea
                    name="description"
                    value={editedTask.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    rows={4}
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority:
                  <input
                    type="range"
                    name="priority"
                    min="1"
                    max="5"
                    value={PRIORITY_LABELS.indexOf(editedTask.priority) + 1}
                    onChange={handleSliderChange}
                    className="mt-1 block w-full"
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Lowest</span>
                    <span>Low</span>
                    <span>Normal</span>
                    <span>High</span>
                    <span>Highest</span>
                  </div>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="ml-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className=" ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
