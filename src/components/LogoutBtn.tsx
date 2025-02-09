import React from "react";
import { signOut, useSession } from "next-auth/react";

const LogoutBtn = () => {
  const { data: session } = useSession();
  return (
    <>
      {session && (
        <div className="bg-red-500 text-white text-center font-bold rounded">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
};

export default LogoutBtn;
