import { Group, MediaQuery, TextInput, Transition } from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  MutableRefObject,
  Ref,
  useRef,
  useState,
} from "react";
import { Search as SearchIcon, X } from "tabler-icons-react";

const searchFade = {
  in: { opacity: 1, width: "100%" },
  out: { opacity: 0, width: 0 },
  transitionProperty: "opacity, width",
};

const Search = () => {
  const router = useRouter();

  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [showInput, showInputHandler] = useDisclosure(false, {
    onOpen: () =>
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200), //0.2s delay just like the animation
  });
  const [query, setQuery] = useState("");

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

    router.push("/search?query=" + query);
  };

  return (
    <Group ref={ref} className="transition-all">
      <MediaQuery
        smallerThan="xs"
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
              <form onSubmit={handleSubmit}>
                <TextInput
                  ref={inputRef}
                  style={styles}
                  className="right-[124px]"
                  value={query}
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
    </Group>
  );
};
export default Search;
