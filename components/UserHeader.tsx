import React from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "../hooks/useLogout";
import useCurrentUser from "@/hooks/useCurrentUser";

const UserHeader: React.FC = () => {
  const router = useRouter();
  const { logout } = useLogout();
  const user = useCurrentUser();

  return (
    <header className="w-full bg-blue-600 text-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-50">
      <h1 className="text-lg font-bold">{user?.name}</h1>
      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
      >
        Logout
      </button>
    </header>
  );
};

export default UserHeader;
