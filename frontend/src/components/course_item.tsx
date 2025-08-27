import React from "react";
import { CourseWithOptions } from "@/client";
import CourseHeader from "./course_header";
import CourseContent from "./course_content";

interface CourseItemProps {
    course: CourseWithOptions;
    isOpen: boolean;
    onToggle: () => void;
}

const CourseItem: React.FC<CourseItemProps> = ({ course, isOpen, onToggle }) => {
    const { courseTitle, summary, options } = course;
    
    return (
        <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <CourseHeader
                courseTitle={courseTitle}
                optionsCount={options ? options.length : 0}
                isOpen={isOpen}
                onToggle={onToggle}
            />
            
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'} ${isOpen ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                <CourseContent 
                    summary={summary}
                    options={options}
                />
            </div>
        </div>
    );
};

export default CourseItem;
