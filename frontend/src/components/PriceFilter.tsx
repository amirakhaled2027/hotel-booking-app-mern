//define our props
type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
}


function PriceFilter({ selectedPrice, onChange }: Props) {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
      className="p-2 border rounded-md w-full"
        value={selectedPrice}
        onChange={(event) =>
          onChange(
            //if there's a value, parse it into a number
            event.target.value ? parseInt(event.target.value) : undefined
          )
        }
      >
        <option value="">Select Max Price</option>
        {[50, 100, 200, 300, 500].map((price) => (
            <option value={price}>{price}</option>
        ))}
      </select>
    </div>
  );
}

export default PriceFilter
//inside the array, we'll ad the values that we wanna to filter on