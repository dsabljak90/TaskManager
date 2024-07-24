import React from "react";
import Link from "next/link";

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6">
          Welcome to Task Management App
        </h1>
        <p className="mb-4">
          Please login if you already have an account or sign up.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="auth/login"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            href="auth/register"
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
