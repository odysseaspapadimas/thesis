import { ScrollArea } from "@mantine/core";
import { CreditsResponse } from "moviedb-promise/dist/request-types";
import Image from "next/image";
import { IMG_URL } from "../constants/tmdbUrls";

const Credits = ({ credits }: { credits: CreditsResponse }) => {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-4">Cast</h2>
      <ScrollArea scrollbarSize={14} type="always" className="pb-4">
        <div className="flex space-x-2 ">
          {credits.cast?.map((cast) => (
            <div
              key={cast.id}
              className="flex flex-col border border-gray-400 rounded-md"
            >
              {!cast.profile_path ? (
                <div className="bg-gray-400 opacity-80 w-[150px] h-[225px]"></div>
              ) : (
                <div className="w-[150px] h-[225px] relative">
                  <Image
                    src={IMG_URL(cast.profile_path)}
                    layout="fill"
                    className="rounded-tl-md rounded-tr-md"
                  />
                </div>
              )}
              <div className="p-2 max-w-[150px]">
                <p className="font-semibold">{cast.name}</p>
                <p>{cast.character}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
export default Credits;
