import LogoutBtn from "@/components/LogoutBtn";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-900">
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <LogoutBtn />
        </div>
      ) : (
        <>
          <button
            onClick={() => signIn("github", { callbackUrl: "/my-page" })}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Sign in with GitHub
          </button>
          <Link
            href="/public-user"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Use as a Public User
          </Link>
        </>
      )}
    </div>
  );
}
