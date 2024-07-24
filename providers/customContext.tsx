"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

interface Task {
  id: number;
  name: string;
  description: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskContextProps {
  tasks: Task[];
  isModalOpen: boolean;
  editedTask: Task | null;
  selectedTask: Task | null;
  isAddTaskOpen: boolean;
  name: string;
  description: string;
  priority: string;
  error: string | null;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  fetchTasks: () => Promise<void>;
  handleUpdate: (e: FormEvent) => Promise<void>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleModalClose: () => void;
  handleTaskClick: (task: Task) => void;
  handleSliderChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDelete: () => void;
  handleTaskCreated: (task: Task) => void;
  handleCreateChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleCreateSliderChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCreate: (e: FormEvent) => Promise<void>;
  setIsAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

/**
 * Provides task management context to its children components.
 *
 * @param {TaskProviderProps} props - The props for the provider component.
 * @param {ReactNode} props.children - The child components that will have access to the context.
 * @returns {JSX.Element} The provider component wrapping the children.
 */
const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
}): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Lowest");
  const [error, setError] = useState<string | null>(null);

  // FETCHING PART

  /**
   * Fetches tasks from the server and updates the state.
   *
   * @returns {Promise<void>} A promise that resolves when the tasks are fetched.
   */
  const fetchTasks = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const tasks = await res.json();
        setTasks(tasks);
      } else {
        throw new Error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // EDIT TASK HANDLERS

  /**
   * Handles changes to input fields within the edit task modal.
   *
   * @param {ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - The change event.
   */
  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      if (editedTask) {
        setEditedTask((prev) => ({
          ...prev!,
          [e.target.name]: e.target.value,
        }));
      }
    },
    [editedTask]
  );

  /**
   * Opens the task modal for editing the selected task.
   *
   * @param {Task} task - The task to be edited.
   */
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setEditedTask({ ...task });
    setIsModalOpen(true);
  }, []);

  /**
   * Closes the task modal and clears the edited task state.
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditedTask(null);
  }, []);

  /**
   * Updates the priority of the edited task based on slider input.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleSliderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      const priorities = ["Lowest", "Low", "Normal", "High", "Highest"];
      if (editedTask) {
        setEditedTask((prev) => ({
          ...prev!,
          priority: priorities[value - 1],
        }));
      }
    },
    [editedTask]
  );

  /**
   * Deletes the currently selected task.
   *
   * @returns {Promise<void>} A promise that resolves when the task is deleted.
   */
  const handleDelete = useCallback(async () => {
    if (selectedTask) {
      try {
        await fetch(`/api/tasks/${selectedTask.id}`, { method: "DELETE" });
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== selectedTask.id)
        );
        handleModalClose();
      } catch (error) {
        console.error("Delete task error:", error);
      }
    }
  }, [selectedTask, handleModalClose]);

  /**
   * Updates an existing task with new details.
   *
   * @param {FormEvent} e - The form event.
   * @returns {Promise<void>} A promise that resolves when the task is updated.
   */
  const handleUpdate = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault();
      if (editedTask) {
        const { id, name, description, priority } = editedTask;
        try {
          const res = await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, priority }),
          });

          if (res.ok) {
            const updatedTask = await res.json();
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              )
            );
            handleModalClose();
          } else {
            throw new Error("Failed to update task");
          }
        } catch (error) {
          console.error("Update task error:", error);
        }
      }
    },
    [editedTask, handleModalClose]
  );

  // NEW TASK HANDLERS

  /**
   * Adds a newly created task to the task list.
   *
   * @param {Task} task - The newly created task.
   */
  const handleTaskCreated = useCallback((task: Task) => {
    setTasks((prevTasks) => [task, ...prevTasks]);
  }, []);

  /**
   * Updates the priority state based on slider input for task creation.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleCreateSliderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const priorities = ["Lowest", "Low", "Normal", "High", "Highest"];
      setPriority(priorities[parseInt(value) - 1]);
    },
    []
  );
  /**
   * Handles changes to input fields for task creation.
   *
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e - The change event.
   */
  const handleCreateChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      if (name === "name") setName(value);
      if (name === "description") setDescription(value);
      if (name === "priority") {
        const priorities = ["Lowest", "Low", "Normal", "High", "Highest"];
        setPriority(priorities[parseInt(value, 10) - 1]);
      }
    },
    []
  );

  /**
   * Creates a new task and adds it to the task list.
   *
   * @param {FormEvent} e - The form event.
   * @returns {Promise<void>} A promise that resolves when the task is created.
   */
  const handleCreate = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault();
      if (!name || !description) {
        setError("Name and description are required");
        return;
      }

      const newTask = { name, description, priority };
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });

        if (res.ok) {
          const task = await res.json();
          handleTaskCreated(task);
          setIsAddTaskOpen(false);
          setName("");
          setDescription("");
          setPriority("Lowest");
        } else {
          throw new Error("Failed to add task");
        }
      } catch (error) {
        setError("Failed to add task");
        console.error("Create task error:", error);
      }
    },
    [name, description, priority, handleTaskCreated]
  );

  const value = useMemo(
    () => ({
      tasks,
      isModalOpen,
      editedTask,
      selectedTask,
      isAddTaskOpen,
      name,
      description,
      priority,
      error,
      setTasks,
      fetchTasks,
      handleUpdate,
      handleChange,
      handleModalClose,
      handleTaskClick,
      handleSliderChange,
      handleDelete,
      handleTaskCreated,
      handleCreateChange,
      handleCreate,
      setIsAddTaskOpen,
      handleCreateSliderChange,
    }),
    [
      tasks,
      isModalOpen,
      editedTask,
      selectedTask,
      isAddTaskOpen,
      name,
      description,
      priority,
      error,
      fetchTasks,
      handleUpdate,
      handleChange,
      handleModalClose,
      handleTaskClick,
      handleSliderChange,
      handleDelete,
      handleTaskCreated,
      handleCreateChange,
      handleCreate,
      setIsAddTaskOpen,
      handleCreateSliderChange,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export { TaskProvider, useTask };
