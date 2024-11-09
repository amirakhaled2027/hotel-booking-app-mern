type Props = {
  selectedStars: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function StarRatingFilter({ selectedStars, onChange }: Props) {
  return (
    <div className="border-b border-zinc-300 pb-5 ">
      <h4 className="text-md font-semibold mb-2 text-emerald-500">
        Property Rating
      </h4>
      {["5", "4", "3", "2", "1"].map((star) => (
        <label className="checkbox-wrapper" key={star}>
          <input
            type="checkbox"
            className={`checkbox ${
              selectedStars.includes(star) ? "checked" : "unchecked"
            }`}
            value={star}
            checked={selectedStars.includes(star)}
            onChange={onChange}
          />
          <span>{star} Stars</span>
        </label>
      ))}
    </div>
  );
}

export default StarRatingFilter;
