import { useState } from "react";
import { LuArrowUpDown } from "react-icons/lu";

type SortDropdownProps = {
  sortOption: string;
  onChange: (value: string) => void;
};

const SortDropdown = ({ sortOption, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "", label: "Sort By" },
    { value: "starRating", label: "Star Rating" },
    { value: "pricePerNightAsc", label: "Price Per Night (low to high)" },
    { value: "pricePerNightDesc", label: "Price Per Night (high to low)" },
  ];

  return (
    <div className="relative ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 border-none bg-zinc-100 text-zinc-400 rounded-sm w-[50%] md:w-[100%] text-left focus:ring-emerald-500 flex justify-between"
      >
        {options.find((option) => option.value === sortOption)?.label ||
          "Sort By"}
        <LuArrowUpDown className="text-emerald-500 font-extrabold text-xl" />
      </button>
      {isOpen && (
        <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-lg z-10">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="p-2 cursor-pointer hover:bg-emerald-500 hover:text-white"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
