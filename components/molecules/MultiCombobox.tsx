import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react";
import React, { useRef, useState } from "react";
import { HiCheck, HiSelector, HiX } from "react-icons/hi";
import { apply, tw } from "twind";
import { Chip } from "../atoms/Chip";

export type ComboboxOption<T> = { label: string; value: T };

export type ComboboxProps<T> = {
  defaultOptions?: ComboboxOption<T>[];
  name?: string;
  className?: string;
  options: ComboboxOption<T>[];
  onChange?: (value: ComboboxOption<T>[]) => void;
};

const MultiCombobox = <T,>({
  name,
  className,
  options,
  defaultOptions = [],
  onChange = () => {},
}: ComboboxProps<T>) => {
  const [selectedOptions, setSelectedOptions] = useState<ComboboxOption<T>[]>(defaultOptions);
  const [query, setQuery] = useState("");

  // hack to open the option dialog
  // https://github.com/tailwindlabs/headlessui/discussions/1205#discussioncomment-2822858
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredOptions = options.filter((option) => {
    if (query === "") {
      return !(selectedOptions.includes(option));
    } else {
      option.label.toLocaleLowerCase().includes(query.toLowerCase())
        && !(selectedOptions.includes(option));
    }
  });

  const handleChange = (options: ComboboxOption<T>[]) => {
    setSelectedOptions(options);
    onChange(options);
  };

  return (
    <HeadlessCombobox multiple name={name} value={selectedOptions} onChange={handleChange}>
      <div className={tw(apply("relative", className))}>
        <div
          className={tw(
            "relative w-full py-1 px-1 border flex cursor-default overflow-hidden rounded-lg bg-white text-left",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300",
            "sm:text-sm",
          )}
        >
          {selectedOptions.map((option, i) => (
            <Chip className={tw("flex items-center m-1")} key={i}>
              {option.label}
              <button
                className={tw("ml-1 focus:outline-none hover:text-red-500")}
                onClick={() => {
                  setSelectedOptions(selectedOptions.filter((o) => o !== option));
                }}
              >
                <HiX className={tw("h-4 w-4")} aria-hidden="true" />
              </button>
            </Chip>
          ))}
          <HeadlessCombobox.Input
            onClick={() => {
              buttonRef.current?.click();
            }}
            className={tw(
              "block w-full px-2 py-2 text-gray-700 placeholder-gray-500 bg-white border-none",
              "focus:outline-none focus:ring-none",
            )}
            onChange={(event) => setQuery(event.target.value)}
          />
          <HeadlessCombobox.Button className={tw("absolute inset-y-0 right-0 flex items-center pr-2")} ref={buttonRef}>
            <HiSelector
              className={tw("h-5 w-5 text-gray-400")}
              aria-hidden="true"
            />
          </HeadlessCombobox.Button>
        </div>
        <Transition
          as={React.Fragment}
          leave={tw("transition ease-in duration-100")}
          leaveFrom={tw("opacity-100")}
          leaveTo={tw("opacity-0")}
          afterLeave={() => setQuery("")}
        >
          <HeadlessCombobox.Options
            className={tw(
              "z-40 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
            )}
          >
            {filteredOptions.length === 0
              ? (
                <div className={tw`relative cursor-default select-none py-2 px-4 text-gray-700`}>
                  Nothing found
                </div>
              )
              : (
                filteredOptions.map((option) => (
                  <HeadlessCombobox.Option
                    key={option.label}
                    className={({ active }) =>
                      tw(
                        "relative cursor-default select-none py-2 pl-10 pr-4",
                        active ? "bg-blue-300 text-white" : "text-gray-900",
                      )}
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <div
                          className={tw`block truncate ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {option.label}
                        </div>
                        {selected
                          ? (
                            <div
                              className={tw`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-cyan-600"
                              }`}
                            >
                              <HiCheck className={tw("h-5 w-5")} aria-hidden="true" />
                            </div>
                          )
                          : null}
                      </>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
          </HeadlessCombobox.Options>
        </Transition>
      </div>
    </HeadlessCombobox>
  );
};

export default MultiCombobox;
