import React from "react";
import { IEvent } from "@/interfaces/event";

const EventData = ({ statData }: { statData: IEvent[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statData.map((event: IEvent) => (
        <div
          className="bg-gray-700 p-4 rounded-lg text-white shadow-lg w-full"
          key={event.id}
        >
          {event?.actor && (
            <div className="flex items-center space-x-3">
              <img
                src={event?.actor?.avatar_url}
                alt={event?.actor?.login}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {event?.actor?.display_login}
                </h2>
                <p className="text-sm text-gray-400">{event?.type}</p>
              </div>
            </div>
          )}
          {event?.repo && (
            <div className="mt-4">
              <p className="text-blue-400 font-medium">{event?.repo?.name}</p>
              <a
                href={event?.repo?.url.replace(
                  "api.github.com/repos",
                  "github.com"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-300 underline"
              >
                View Repository
              </a>
            </div>
          )}
          {event?.created_at && (
            <p className="text-xs text-gray-400 mt-2">
              {new Date(event?.created_at).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventData;
