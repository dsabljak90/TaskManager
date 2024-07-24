"use client";
import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Custom hook for fetching the current authenticated user.
 *
 * @returns {User | null} The current user object if authenticated, otherwise null.
 */
const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.userData);
        } else {
          setUser(null);
          throw new Error("Failed to fetch user" + res.status);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);
  return user;
};

export default useCurrentUser;
