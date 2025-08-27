import React from "react";
import { FiAward } from "react-icons/fi";
import { OptionsGalleryResult } from "@/client";
import CourseOption from "./course_option";

interface CourseContentProps {
    summary: string;
    options?: OptionsGalleryResult[] | null;
}

const CourseContent: React.FC<CourseContentProps> = ({ summary, options }) => {
    return (
        <div className="bg-gray-50 border-t border-gray-200">
            <div className="p-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 scroll-smooth">
                <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Course Summary</h4>
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                        {summary || "No summary available"}
                    </p>
                </div>

                {options && options.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                            <FiAward size={14} />
                            Available Options ({options.length})
                        </h4>
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <CourseOption 
                                    key={option.id || index} 
                                    option={option} 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseContent;
