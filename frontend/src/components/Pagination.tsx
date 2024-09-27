//passing the page parameter to our search api 

//creating a type for the props that this component will expect
export type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
}


function Pagination({ page, pages, onPageChange }: Props) {

    //creating an array of page numbers this is so that we can display
    //a number for each page and our pagination component at the bottom 
    //of our search result page which let the user jump to whatever page they want 
    const pageNumbers = [];
    //so if we have a total page count of 10, this for loop will run 10 times
    //we will display the numbers 1 to 10, and we will add the numbers 1 to 10 individually
    for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
    }
  return (
    // a div that will be the container for our pagination  
    <div className="flex justify-center">
        <ul className="flex border border-slate-300">
            {pageNumbers.map((number) => (
                //if the user has clicked on page number 3 for example
                //then the third button in our pagination component will have a background color of gray
                //otherwise it'll just have the default background color
                <li key={number} className={`px-2 py-1 ${page === number ? "bg-gray-200" : ""}`}>
                    {/* whenever this button get clicked, call the onPageChange function that the parent component has passed to our pagination component  */}
                    <button onClick={() => onPageChange(number)}>{number}</button>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default Pagination