import React from "react";
import { IGist } from "@/interfaces/gist";

const GistData = ({ statData }: { statData: IGist[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-900 text-left text-sm">
            <th className="p-2">Name</th>
            <th className="p-2">Owner</th>
            <th className="p-2">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {statData.map((gist: IGist) => (
            <tr key={gist.id} className="border-b border-gray-700  text-sm">
              <td className="p-4 break-all">
                {gist.html_url && (
                  <a
                    href={gist.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {gist.name || "Gist Link"}
                  </a>
                )}
              </td>
              <td className="p-2 flex-col items-center justify-center mx-2">
                {gist?.owner && gist.owner?.avatar_url && (
                  <>
                    <img
                      src={gist.owner.avatar_url}
                      alt={gist.owner.login}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <a
                      href={gist.owner.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {gist.owner.login}
                    </a>
                  </>
                )}
              </td>
              {gist.updated_at && (
                <td className="p-2">
                  {gist.updated_at
                    ? `${new Date(gist.updated_at).toLocaleDateString()}`
                    : ""}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GistData;
