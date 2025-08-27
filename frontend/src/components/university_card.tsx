import React from "react";
import { GiGraduateCap } from "react-icons/gi";
import { FiMapPin, FiExternalLink, FiBookOpen } from "react-icons/fi";
import CompetitionLevel from "./competition_level";
import { ProviderWithAddress } from "@/client";

interface CardProps {
    provider: ProviderWithAddress
}

const Card: React.FC<CardProps> = ({ provider }) => {
    const { name, course_count, competition_level, provider_ID, logoUrl, address } = provider;
    
    const fixCollegeTitle = () => {
        const regex = /\s*\(.*?\)\s*/;
        const regex2 = /\[(.*?)\]/;
        const fixedTitle = name.replace(regex, " ");
        const match = fixedTitle.match(regex2);
        return match ? fixedTitle.replace(regex2, match[1].toLowerCase()) : fixedTitle;
    };
    
    const handleShowCourses = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.location.href = `/${provider_ID}/courses`;
    }

    const formatAddress = () => {
        if (!address) return null;
        const parts = [];
        if (address.line1) parts.push(address.line1);
        if (address.region) parts.push(address.region);
        if (address.country) parts.push(address.country);
        return parts.length > 0 ? parts.join(", ") : null;
    };

    return (
        <div className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-4 h-2/3">
                <div className="absolute top-4 right-4">
                    {logoUrl ? (
                        <img 
                            src={logoUrl} 
                            alt={`${name} logo`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-white"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <div className={`w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-sm ${logoUrl ? 'hidden' : ''}`}>
                        <GiGraduateCap className="text-white" size={24} />
                    </div>
                </div>
                
                <div className="pr-16">
                    <h3 
                        className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2"
                        title={fixCollegeTitle()}
                    >
                        {fixCollegeTitle()}
                    </h3>
                    
                    {formatAddress() && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                            <FiMapPin className="mr-1 flex-shrink-0" size={14} />
                            <span className="truncate" title={formatAddress()!}>{formatAddress()}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6 pt-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-700">
                        <FiBookOpen className="mr-2 text-blue-600" size={16} />
                        <span className="text-sm font-medium">{course_count} Courses</span>
                    </div>
                    
                    {competition_level && (
                        <CompetitionLevel level={competition_level} />
                    )}
                </div>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-blue-700 mt-auto"
                    onClick={handleShowCourses}
                >
                    <span>View Courses</span>
                    <FiExternalLink size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </div>
    );
};

export default Card;
