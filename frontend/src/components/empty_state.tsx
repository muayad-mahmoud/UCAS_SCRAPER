import React from "react";
import { FiBookOpen } from "react-icons/fi";

const EmptyState: React.FC = () => {
    return (
        <div className="text-center py-8">
            <div className="p-4 bg-gray-100 rounded-lg inline-flex items-center gap-2 text-gray-600">
                <FiBookOpen size={20} />
                <span>No courses available</span>
            </div>
        </div>
    );
};

export default EmptyState;
