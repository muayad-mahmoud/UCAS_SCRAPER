import React from "react";
import { FiBookOpen } from "react-icons/fi";

interface AccordionHeaderProps {
    coursesCount: number;
    allExpanded: boolean;
    onToggleAll: () => void;
    currentPageInfo?: string;
}

const AccordionHeader: React.FC<AccordionHeaderProps> = ({ 
    coursesCount, 
    allExpanded, 
    onToggleAll,
    currentPageInfo
}) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FiBookOpen className="text-blue-600" />
                    Courses ({coursesCount})
                </h2>
                {currentPageInfo && (
                    <p className="text-sm text-gray-600 mt-1">{currentPageInfo}</p>
                )}
            </div>
            <button
                onClick={onToggleAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
            >
                {allExpanded ? 'Collapse All' : 'Expand All'}
            </button>
        </div>
    );
};

export default AccordionHeader;
