
//defining a type for this component
type Props = {
    //store the state of the star rating that the user has selected in the parent 
    //and then we'll pass the state stuff so that we're keeping all the state
    //centralized on the search page 
    selectedStars: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    };

function StarRatingFilter({ selectedStars, onChange }: Props) {
  return (
    <div className="border-b border-slate-300 pb-5">
        <h4 className="text-md font-semibold mb-2">Property Rating</h4>
        {["5", "4", "3", "2", "1"].map((star) => (
            <label className="flex items-center space-x-2" key={star}>
              <input
              key={star}
                type="checkbox"
                className="rounded"
                value={star}
                checked={selectedStars.includes(star)}
                onChange={onChange}
              />
              <span>{star} Stars</span>
            </label>
        ))}
    </div>
  )
}

export default StarRatingFilter