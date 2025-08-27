import React from "react";
import { FiHome } from "react-icons/fi";

interface UniversityHeaderProps {
    universitiesCount: number;
    currentPageInfo?: string;
    itemsPerPage?: number;
    onItemsPerPageChange?: (limit: number) => void;
    isSearching?: boolean;
}

const UniversityHeader: React.FC<UniversityHeaderProps> = ({ 
    universitiesCount,
    currentPageInfo,
    itemsPerPage,
    onItemsPerPageChange,
    isSearching = false
}) => {
    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value);
        onItemsPerPageChange?.(newLimit);
    };

    return (
        <div className="flex items-center justify-between mb-6 w-full">
            <div className={`text-center flex-1 ${!isSearching && onItemsPerPageChange ? 'translate-x-20' : ''}`}>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-2">
                    <FiHome className="text-blue-600" />
                    Universities ({universitiesCount})
                </h1>
                {currentPageInfo && (
                    <p className="text-sm text-gray-600">{currentPageInfo}</p>
                )}
            </div>
            
            {!isSearching && onItemsPerPageChange && (
                <div className="flex items-center text-sm text-gray-600 ml-4">
                    <label htmlFor="items-per-page" className="mr-2 whitespace-nowrap">
                        Show:
                    </label>
                    <select
                        id="items-per-page"
                        value={itemsPerPage}
                        onChange={handleLimitChange}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                    <span className="ml-1 whitespace-nowrap">per page</span>
                </div>
            )}
        </div>
    );
};

export default UniversityHeader;
