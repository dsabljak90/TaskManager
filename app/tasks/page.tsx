"use client";
import Footer from "@/components/Footer";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import UserHeader from "@/components/UserHeader";

const TasksPage: React.FC = () => {
  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <TaskList />
        <TaskForm />
      </div>
      <Footer />
    </>
  );
};

export default TasksPage;
