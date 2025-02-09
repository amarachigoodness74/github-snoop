import React from "react";
import { signOut, useSession } from "next-auth/react";

const LogoutBtn = () => {
  const { data: session } = useSession();
  return (
    <>
      {session && (
        <div className="px-4 py-2 bg-red-500 text-white rounded">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
};

export default LogoutBtn;
