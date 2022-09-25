import { ScrollArea } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { CreditsResponse } from "moviedb-promise";
import Image from "next/image";
import Link from "next/link";
import { MutableRefObject, UIEvent, useEffect, useRef, WheelEvent, WheelEventHandler } from "react";
import { User } from "tabler-icons-react";
import { IMG_URL } from "../constants/tmdbUrls";
import { AggregateCredits } from "../constants/types";

const ShowCredits = ({ credits }: { credits: AggregateCredits }) => {
  console.log(credits, "credits");

  const scrollRef = useHorizontalScroll();

  return (
    <div className="py-6 md:w-[75%]">
      <h2 className="text-2xl font-semibold mb-4">Cast</h2>
      <ScrollArea viewportRef={scrollRef} scrollbarSize={16} type="always" className="pb-4 ">
        <div className="flex space-x-4">
          {credits.cast?.map((cast) => (
            <div
              key={cast.id}
              className="flex flex-col border-gray-400 rounded-md"
            >
              {!cast.profile_path ? (
                <NextLink
                  href={`/person/${cast.id}-${cast.name
                    ?.toLowerCase()
                    .replace(/[\W_]+/g, "-")}`}
                >
                  <div className="bg-gray-700 rounded-md grid place-items-center opacity-80 w-[150px] h-[225px]">
                    <User size={46} />
                  </div>
                </NextLink>
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
                <div>
                  {cast.roles && cast.roles.map((role, i) => (
                    i <= 3 && <p key={role.credit_id + i}>{role.character}</p>
                  ))}
                  {cast.roles !== undefined && cast.roles.length - 4 > 0 && <p>and {cast.roles.length - 4} more...</p>}
                </div>
                <p className="text-gray-400">{cast.total_episode_count} {cast.total_episode_count === 1 ? 'episode' : 'episodes'}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
export default ShowCredits;

const useHorizontalScroll = () => {
  const elRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e: globalThis.WheelEvent) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + (e.deltaY * 3),
          behavior: "smooth"
        });
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);
  return elRef;
}
