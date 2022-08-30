import { ScrollArea } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { CreditsResponse } from "moviedb-promise";
import Image from "next/image";
import Link from "next/link";
import { User } from "tabler-icons-react";
import { IMG_URL } from "../constants/tmdbUrls";

const Credits = ({ credits }: { credits: CreditsResponse }) => {
  console.log(credits, "credits");
  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-4">Cast</h2>
      <ScrollArea scrollbarSize={14} type="always" className="pb-4">
        <div className="flex space-x-4">
          {credits.cast?.map((cast) => (
            <div
              key={cast.id}
              className="flex flex-col border-gray-400 rounded-md"
            >
              {!cast.profile_path ? (
                <div className="bg-gray-700 rounded-md grid place-items-center opacity-80 w-[150px] h-[225px]">
                  <User size={46}/>
                </div>
              ) : (
                <div className="w-[150px] h-[225px] relative">
                  <NextLink
                    href={`/person/${cast.id}-${cast.name
                      ?.toLowerCase()
                      .replace(/[\W_]+/g, "-")}`}
                  >
                    <Image
                      src={IMG_URL(cast.profile_path)}
                      layout="fill"
                      className="rounded-tl-md rounded-tr-md"
                    />
                  </NextLink>
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
