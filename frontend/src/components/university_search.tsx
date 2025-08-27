import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface UniversitySearchProps {
    onSearch: (query: string) => void;
    onClear: () => void;
    currentQuery?: string;
    placeholder?: string;
}

const UniversitySearch: React.FC<UniversitySearchProps> = ({
    onSearch,
    onClear,
    currentQuery = "",
    placeholder = "Search universities..."
}) => {
    const [searchInput, setSearchInput] = useState(currentQuery);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            onSearch(searchInput.trim());
        }
    };

    const handleClear = () => {
        setSearchInput("");
        onClear();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        if (e.target.value === "") {
            onClear();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mb-6">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                    <FiSearch 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                    />
                    {(searchInput || currentQuery) && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    )}
                </div>
                
                {searchInput && searchInput !== currentQuery && (
                    <button
                        type="submit"
                        className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        Search Universities
                    </button>
                )}
            </form>
            
            {currentQuery && (
                <div className="mt-2 flex items-center justify-center text-sm text-gray-600">
                    <span>Searching for: "{currentQuery}"</span>
                    <button
                        onClick={handleClear}
                        className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
};

export default UniversitySearch;
