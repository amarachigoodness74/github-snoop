import React from "react";
import { IOrg } from "@/interfaces/org";

const OrganizationData = ({ statData }: { statData: IOrg[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statData.map((org: IOrg) => (
        <div
          className="bg-gray-700 p-4 rounded-lg text-white shadow-lg w-full"
          key={org.id}
        >
          {org?.avatar_url && (
            <div className="flex-col items-center">
              <img
                src={org?.avatar_url}
                alt={org?.login}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold">{org?.login}</h2>
                <p className="text-sm text-gray-400">{org?.description}</p>
              </div>
            </div>
          )}
          {org?.url && (
            <div className="mt-4">
              <a
                href={org?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-300 underline"
              >
                View Organization
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrganizationData;
