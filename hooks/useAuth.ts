import { isError } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "login" | "register";

/**
 * Creates a new task and adds it to the task list.
 *
 * @param {FormEvent} e - The form event.
 */

const useAuth = (mode: AuthMode) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = {
      email,
      password,
      name: mode === "register" ? name : undefined,
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "An unknown error occurred");
      }

      if (mode === "register") {
        router.push("/auth/login");
      } else {
        router.push("/tasks");
      }
    } catch (error) {
      if (isError(error)) {
        setError(error.message || "An error occurred. Please try again.");
        console.error("Error:", error);
      }
    }
  };

  return {
    email,
    password,
    name,
    error,
    setEmail,
    setPassword,
    setName,
    handleSubmit,
  };
};

export default useAuth;
