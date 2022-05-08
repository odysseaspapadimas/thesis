import { Group, MediaQuery, TextInput } from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  MutableRefObject,
  Ref,
  useRef,
  useState,
} from "react";
import { Search as SearchIcon, X } from "tabler-icons-react";

const Search = () => {
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

  return (
    <Group ref={ref} className="transition-all">
      {showInput && (
        <MediaQuery
          smallerThan="sm"
          styles={{
            width: "100%",
            top: 70,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute z-20">
            <TextInput
              ref={inputRef}
              className=" animate-fadeIn sm:right-[124px]"
              value={query}
              onChange={onChangeQuery}
              placeholder="Not working yet..."
              rightSection={
                <X
                  onClick={handleClearQuery}
                  size={16}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
              }
            />
          </div>
        </MediaQuery>
      )}
      <div className="border border-transparent hover:border-primary transition-all cursor-pointer rounded-sm h-[38px] w-[38px] grid place-items-center">
        {!showInput ? (
          <SearchIcon onClick={showInputHandler.open} spacing="lg" />
        ) : (
          <X onClick={showInputHandler.close} spacing="lg" />
        )}
      </div>
    </Group>
  );
};
export default Search;
