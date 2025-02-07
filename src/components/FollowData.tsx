import { IUserData } from "@/interfaces/user";

const UserData = ({ statData }: { statData: IUserData[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statData.map((userData) => (
        <div
          key={userData.id}
          className="bg-gray-700 text-center p-4 mx-auto w-full"
        >
          <img
            src={userData.avatar_url}
            alt="Avatar"
            className="w-20 h-20 rounded-full mx-auto"
          />

          <div className="my-2 text-center">
            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-blue-400"
            >
              <h2 className="text-lg">{userData.name || userData.login}</h2>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserData;
