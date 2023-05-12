import { Center, Group, Loader, MediaQuery, TextInput, Transition } from "@mantine/core";
import { useClickOutside, useDebouncedValue, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import { MovieResult, MovieResultsResponse, SearchPersonResponse, TvResult, TvResultsResponse } from "moviedb-promise";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FormEvent,
  FormEventHandler,
  MutableRefObject,
  Ref,
  SetStateAction,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { DeviceTv, Movie, Search as SearchIcon, User, X } from "tabler-icons-react";
import fetcher from "../helpers/fetcher";
import Person from "./Search/Results/Person";
import Show from "./Search/Results/Show";

export interface PersonResult {
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for?: [];
  known_for_department?: string;
  media_type: "person";
  name?: string;
  popularity?: number;
  profile_path?: string;
}

interface SearchMultiResponse {
  results: Array<MovieResult | TvResult | PersonResult>;
  total_results: number;
  total_pages: number;
}


const Search = ({ setNavOpened }: { setNavOpened: Dispatch<SetStateAction<boolean>> }) => {
  const router = useRouter();

  const matches = useMediaQuery('(max-width: 62em)', true, { getInitialValueInEffect: true })

  const searchFade = {
    in: { opacity: 1, width: !matches ? "300px" : "100%" },
    out: { opacity: 0, width: 0 },
    transitionProperty: "opacity, width",
  };
  const resultFade = {
    in: { opacity: 1, height: "unset" },
    out: { opacity: 0, height: 0 },
    transitionProperty: "opacity, height",
  };


  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [showInput, showInputHandler] = useDisclosure(false, {
    onOpen: () =>
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200), //0.2s delay just like the animation
  });
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(encodeURIComponent(query), 200);

  const { data: movie } = useSWR<MovieResultsResponse>(debouncedQuery ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${debouncedQuery}` : null, fetcher);
  const { data: show } = useSWR<TvResultsResponse>(debouncedQuery ? `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${debouncedQuery}` : null, fetcher);
  const { data: person } = useSWR<SearchPersonResponse>(debouncedQuery ? `https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${debouncedQuery}` : null, fetcher);


  const ref = useClickOutside(showInputHandler.close, ["mouseup", "touchend"]);

  const onChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!query) return;
    setQuery("");
    showInputHandler.close();
    console.log("/search?q=" + encodeURIComponent(query) + "&page=1", 'url')
    router.push("/search?q=" + encodeURIComponent(query) + "&page=1");
  };

  return (
    <Group onClick={() => setNavOpened(false)} ref={ref} className="transition-all">
      <MediaQuery
        smallerThan="md"
        styles={{
          position: 'absolute',
          width: "95%",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div className=" z-20">
          <Transition
            mounted={showInput}
            transition={searchFade}
            exitDuration={500}
            duration={500}
          >
            {(styles) => (
              <div className="relative">
                <form onSubmit={handleSubmit}>
                  <TextInput
                    ref={inputRef}
                    style={styles}
                    value={query}
                    classNames={{
                      input: `${!!query && showInput && "rounded-none rounded-t-md"}`
                    }}
                    onChange={onChangeQuery}
                    placeholder="e.g. The Office"
                    rightSection={
                      <X
                        onClick={handleClearQuery}
                        size={16}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      />
                    }
                  />
                </form>
                <Transition
                  mounted={!!query && showInput}
                  transition={resultFade}
                  exitDuration={500}
                  duration={500}
                >
                  {(styles2) => (
                    <div style={styles2} className="rounded-b-md absolute bg-[#25262B] w-full z-[999]">
                      {!movie || !show || !person ? (
                        <div className="w-full h-full grid place-items-center">
                          <Loader />
                        </div>
                      ) : !movie.results?.at(0) && !show.results?.at(0) && !person.results?.at(0) ? (
                        <div className="w-full h-full grid place-items-center">
                          <p>No results found</p>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {movie && movie.results?.at(0) && (
                            <NextLink onClick={() => {
                              showInputHandler.close();
                              setQuery("");
                            }} href={`/movie/${movie.results[0].id}-${movie.results[0].title?.toLowerCase().replace(/[\W_]+/g, "-")}`}>
                              <div className="flex w-full justify-between items-center hover:bg-[#1A1B1E] px-3 py-4">

                                <p className="font-semibold">
                                  {movie.results[0].title}
                                </p>
                                <Movie />
                              </div>
                            </NextLink>
                          )}
                          {show && show.results?.at(0) && (
                            <NextLink onClick={() => {
                              showInputHandler.close();
                              setQuery("");
                            }} href={`/show/${show.results[0].id}-${show.results[0].name?.toLowerCase().replace(/[\W_]+/g, "-")}`}>
                              <div className="flex w-full justify-between items-center hover:bg-[#1A1B1E] px-3 py-4">

                                <p className="font-semibold">
                                  {show.results[0].name}
                                </p>
                                <DeviceTv />
                              </div>
                            </NextLink>
                          )}
                          {person && person.results?.at(0) && (
                            <NextLink onClick={() => {
                              showInputHandler.close();
                              setQuery("");
                            }} href={`/person/${person.results[0].id}-${person.results[0].name?.toLowerCase().replace(/[\W_]+/g, "-")}`}>
                              <div className="flex w-full justify-between items-center hover:bg-[#1A1B1E] px-3 py-4">

                                <p className="font-semibold">
                                  {person.results[0].name}
                                </p>
                                <User />
                              </div>
                            </NextLink>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Transition>
              </div>
            )}
          </Transition>
        </div>
      </MediaQuery>
      <div
        onClick={() =>
          showInput ? showInputHandler.close() : showInputHandler.open()
        }
        className="border border-transparent hover:border-primary transition-all cursor-pointer rounded-sm h-[38px] w-[38px] grid place-items-center"
      >
        {!showInput ? <SearchIcon spacing="lg" /> : <X spacing="lg" />}
      </div>
    </Group >
  );
};
export default Search;
