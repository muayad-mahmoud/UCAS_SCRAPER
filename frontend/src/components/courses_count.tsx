import React from 'react';
import { FiBookOpen } from 'react-icons/fi';

interface CourseCountProps {
    count: number;
}

const CourseCount: React.FC<CourseCountProps> = ({ count }) => {
    return (
        <div className="flex items-center">
            <FiBookOpen className="mr-2" />
            <span className="text-gray-700">{count}</span>
        </div>
    );
};

export default CourseCount;
