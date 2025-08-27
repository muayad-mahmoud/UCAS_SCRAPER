import React from "react";
import { FiMapPin, FiClock, FiCalendar, FiAward } from "react-icons/fi";
import { OptionsGalleryResult } from "@/client";

interface CourseOptionProps {
    option: OptionsGalleryResult;
}

const CourseOption: React.FC<CourseOptionProps> = ({ option }) => {
    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                {option.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin size={12} className="text-green-600" />
                        <span className="truncate">{option.location}</span>
                    </div>
                )}
                {option.duration && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <FiClock size={12} className="text-blue-600" />
                        <span>{option.duration}</span>
                    </div>
                )}
                {option.startDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar size={12} className="text-purple-600" />
                        <span>{option.startDate}</span>
                    </div>
                )}
                {option.Qualification && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <FiAward size={12} className="text-orange-600" />
                        <span>{option.Qualification}</span>
                    </div>
                )}
            </div>
            {option.googleMapsUrl && (
                <a
                    href={option.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                    <FiMapPin size={12} />
                    View on Maps
                </a>
            )}
        </div>
    );
};

export default CourseOption;
