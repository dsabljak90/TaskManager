import React from "react";
import { useTask } from "@/providers/customContext";
import { PRIORITY_LABELS } from "@/utils/labels";

const TaskForm: React.FC = () => {
  const {
    handleCreateChange,
    handleCreateSliderChange,
    handleCreate,
    name,
    description,
    priority,
    error,
    setIsAddTaskOpen,
    isAddTaskOpen,
  } = useTask();

  return (
    <>
      <button
        onClick={() => setIsAddTaskOpen(true)}
        className="bg-blue-500 text-white py-2 px-4  rounded hover:bg-blue-600 transition mb-7 mt-4"
      >
        Add New Task
      </button>
      {isAddTaskOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
            <form
              onSubmit={handleCreate}
              className="space-y-4 bg-gray-100 p-4 rounded-lg "
            >
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleCreateChange}
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
                    value={description}
                    onChange={handleCreateChange}
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
                    value={PRIORITY_LABELS.indexOf(priority) + 1}
                    onChange={handleCreateSliderChange}
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
              <div className="flex justify-between items-center">
                <div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                  >
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(false)}
                    className="ml-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskForm;
