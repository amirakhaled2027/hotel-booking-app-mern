import { hotelFacilities } from "../config/hotel-options-config";

type Props = {
  selectedFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function FacilitiesFilter({ selectedFacilities, onChange }: Props) {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2 text-emerald-500">
        Facilities
      </h4>
      {hotelFacilities.map((facility) => (
        <label className="flex items-center space-x-2" key={facility}>
          <input
            key={facility}
            type="checkbox"
            className={`checkbox ${
              selectedFacilities.includes(facility) ? "checked" : "unchecked"
            }`}
            value={facility}
            checked={selectedFacilities.includes(facility)}
            onChange={onChange}
          />
          <span>{facility}</span>
        </label>
      ))}
    </div>
  );
}

export default FacilitiesFilter;
