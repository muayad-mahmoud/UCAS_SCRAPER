import React from "react";
import { FiChevronDown, FiChevronUp, FiBookOpen } from "react-icons/fi";

interface CourseHeaderProps {
    courseTitle: string;
    optionsCount: number;
    isOpen: boolean;
    onToggle: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ 
    courseTitle, 
    optionsCount, 
    isOpen, 
    onToggle 
}) => {
    return (
        <button
            onClick={onToggle}
            className="w-full p-4 bg-white hover:bg-gray-50 transition-colors duration-200 text-left flex items-center justify-between group"
        >
            <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                    <FiBookOpen className="text-blue-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                        {courseTitle}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">
                        Options: {optionsCount}
                    </p>
                </div>
            </div>
            <div className="ml-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </div>
        </button>
    );
};

export default CourseHeader;
