import React from "react";
import { IoSpeedometerOutline } from "react-icons/io5";
import { useCompetitionLevel } from "@/hooks/use_competition_level";
import { CompetitionLevel as CompetitionLevelEnum } from "../utils/enums";

interface CompetitionLevelProps {
    level: string;
}

const CompetitionLevel: React.FC<CompetitionLevelProps> = ({ level }) => {
    const { textColor, backgroundColor } = useCompetitionLevel(level as CompetitionLevelEnum);

    return (
        <div className={`flex items-center px-3 py-1.5 rounded-full ${backgroundColor} w-auto h-auto text-xs font-medium shadow-sm`}>
            <IoSpeedometerOutline className={`mr-1.5 ${textColor}`} size={14} />
            <span className={`${textColor}`}>{level}</span>
        </div>
    );
};

export default CompetitionLevel;
