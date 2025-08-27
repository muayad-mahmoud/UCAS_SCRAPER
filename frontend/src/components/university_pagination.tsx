import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface UniversityPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const UniversityPagination: React.FC<UniversityPaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const nextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToPage = (page: number) => {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between mt-8 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center text-sm text-gray-700">
                <span>
                    Showing {startIndex + 1}-{endIndex} of {totalItems} universities
                </span>
            </div>
            
            <div className="flex items-center space-x-2">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    } transition-colors duration-200`}
                >
                    <FiChevronLeft className="mr-1" size={16} />
                    Previous
                </button>

                <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                            return (
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - currentPage) <= 1
                            );
                        })
                        .map((page, index, array) => (
                            <React.Fragment key={page}>
                                {index > 0 && array[index - 1] !== page - 1 && (
                                    <span className="text-gray-400 px-2">...</span>
                                )}
                                <button
                                    onClick={() => goToPage(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                        page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                    } transition-colors duration-200`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        ))
                    }
                </div>

                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    } transition-colors duration-200`}
                >
                    Next
                    <FiChevronRight className="ml-1" size={16} />
                </button>
            </div>
        </div>
    );
};

export default UniversityPagination;
