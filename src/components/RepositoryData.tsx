import { IRepo } from "@/interfaces/repo";

const RepoData = ({ statData }: { statData: IRepo[] }) => {
  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-900 text-left text-sm">
            <th className="p-2 min-w-[120px]">Name</th>
            <th className="p-2">Owner</th>
            <th className="p-2">Stars</th>
            <th className="p-2">Forks</th>
            <th className="p-2">Issues</th>
            <th className="p-2">Size (KB)</th>
            <th className="p-2">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {statData.map((repo: IRepo) => (
            <tr key={repo.id} className="border-b border-gray-700  text-sm">
              <td className="p-4 break-all">
                {repo.html_url && (
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {repo.name || "Gist Link"}
                  </a>
                )}
              </td>
              <td className="p-2 flex-col items-center justify-center mx-2">
                {repo?.owner && repo.owner?.avatar_url && (
                  <>
                    <img
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <a
                      href={repo.owner.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {repo.owner.login}
                    </a>
                  </>
                )}
              </td>
              <td className="p-2 text-center">
                {repo.stargazers_count ? `${repo.stargazers_count}` : ""}
              </td>
              <td className="p-2 text-center">
                {repo.forks_count ? `${repo.forks_count}` : ""}
              </td>
              <td className="p-2 text-center">
                {repo.open_issues_count ? `${repo.open_issues_count}` : ""}
              </td>
              <td className="p-2 text-center">
                {repo.size ? `${repo.size}` : ""}
              </td>
              <td className="p-2">
                {repo.updated_at
                  ? `${new Date(repo.updated_at).toLocaleDateString()}`
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepoData;
