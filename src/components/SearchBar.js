import { useState } from "react";

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();  // Prevents page reload
        if (searchTerm.trim() !== "") {
            onSearch(searchTerm);  // Pass search term to parent component
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    className="searchBar"
                    placeholder="Search for a song..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                ></input>
                <button 
                        id="SearchButton"
                        type="submit"
                >Search</button>
            </form>
        </>
    )
};

export default SearchBar