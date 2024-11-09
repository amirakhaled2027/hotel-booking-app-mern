import { useState } from "react";
import { LuArrowUpDown } from "react-icons/lu";

type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

function PriceFilter({ selectedPrice, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value?: number) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div>
      <h4 className="text-md font-semibold mb-2 text-emerald-500">Max Price</h4>
      <div className="relative border-b border-zinc-300 pb-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 border-none bg-zinc-100 text-zinc-400 rounded-sm w-full text-left focus:ring-emerald-500 flex justify-between"
        >
          {selectedPrice ? `Up to $${selectedPrice}` : "Select Max Price"}
          <LuArrowUpDown className="text-emerald-500 font-extrabold text-xl" />
        </button>
        {isOpen && (
          <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-lg z-10">
            <li
              onClick={() => handleSelect(undefined)}
              className="p-2 cursor-pointer hover:bg-emerald-500 hover:text-white"
            >
              Select Max Price
            </li>
            {[50, 100, 200, 300, 500].map((price) => (
              <li
                key={price}
                onClick={() => handleSelect(price)}
                className="p-2 cursor-pointer hover:bg-emerald-500 hover:text-white"
              >
                Up to ${price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PriceFilter;
