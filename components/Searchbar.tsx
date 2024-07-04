"use client";

import { FormEvent, useState } from "react";
import { scrapeAndStoreProduct } from "@/lib/actions";

const isValidAmazonProductLink = (url: string) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;
        if (
            hostname.includes("amazon.com") ||
            hostname.includes("amazon.") ||
            hostname.endsWith("amazon")
        ) {
            return true;
        }
    } catch (err) {
        console.log(err);
    }
};

const SearchBar = () => {
    const [searchPrompt, setSearchPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValidLink = isValidAmazonProductLink(searchPrompt);
        if (!isValidLink) {
            alert("Please enter a valid Amazon product link");
        }

        try {
            setIsLoading(true);
            // Scrape the product details
            const product = await scrapeAndStoreProduct(searchPrompt);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
            <input
                type="text"
                value={searchPrompt}
                onChange={(e) => {
                    setSearchPrompt(e.target.value);
                }}
                name="searchQuery"
                placeholder="Enter product link"
                className="searchbar-input"
            />
            <button
                type="submit"
                className="searchbar-btn"
                disabled={searchPrompt === ""}
            >
                {isLoading ? "Searching..." : "Search"}
            </button>
        </form>
    );
};

export default SearchBar;
