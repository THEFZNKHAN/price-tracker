"use client";

const SearchBar = () => {
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // TODO
    };

    return (
        <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
            <input
                type="text"
                name="searchQuery"
                placeholder="Enter product link"
                className="searchbar-input"
            />
            <button type="submit" className="searchbar-btn">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
