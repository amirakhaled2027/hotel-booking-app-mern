import { hotelTypes } from "../config/hotel-options-config";

type Props = {
  selectedHotelTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function HotelTypesFilter({ selectedHotelTypes, onChange }: Props) {
  return (
    <>
      <div className="border-b border-slate-300 pb-5">
        <h4 className="text-md font-semibold mb-2 text-emerald-500 ">
          Hotel Type
        </h4>
        {hotelTypes.map((hotelType) => (
          <label className="flex items-center space-x-2" key={hotelType}>
            <input
              key={hotelType}
              type="checkbox"
              className={`checkbox ${
                selectedHotelTypes.includes(hotelType) ? "checked" : "unchecked"
              }`}
              value={hotelType}
              checked={selectedHotelTypes.includes(hotelType)}
              onChange={onChange}
            />
            <span>{hotelType}</span>
          </label>
        ))}
      </div>
    </>
  );
}

export default HotelTypesFilter;
