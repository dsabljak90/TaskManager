"use client";

import Link from "next/link";
import useAuth from "@/hooks/useAuth";

interface AuthFormProps {
  mode: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const {
    email,
    password,
    name,
    error,
    handleSubmit,
    setEmail,
    setPassword,
    setName,
  } = useAuth(mode);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 bg-white rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {mode === "register" && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {mode === "login" ? "Login" : "Register"}
      </button>
      <div className="mt-4 text-center">
        <Link className="text-blue-500 hover:underline" href="/">
          Back to Welcome Screen
        </Link>
      </div>
    </form>
  );
};

export default AuthForm;
