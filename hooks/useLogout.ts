"use client";
import { useRouter } from "next/navigation";

/**
 * Custom hook for handling user logout.
 *
 * @returns {function} return.logout - Function to log out the user.
 */
export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to log out: " + res.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    logout,
  };
};
