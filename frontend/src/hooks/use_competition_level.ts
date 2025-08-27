import { CompetitionLevel } from "../utils/enums";
import { useMemo } from "react";
interface returnCompetitionStyle {
    textColor: string;
    backgroundColor: string;

}
export function useCompetitionLevel(level: CompetitionLevel): returnCompetitionStyle {
    return useMemo(() => {
        switch (level) {
            case CompetitionLevel.ULTRA_COMPETITIVE:
                return {
                    textColor: "text-red-500",
                    backgroundColor: "bg-red-100",
                };
            case CompetitionLevel.HIGHLY_COMPETITIVE:
                return {
                    textColor: "text-orange-500",
                    backgroundColor: "bg-orange-100",
                };
            case CompetitionLevel.COMPETITIVE:
                return {
                    textColor: "text-yellow-500",
                    backgroundColor: "bg-yellow-100",
                };
            case CompetitionLevel.ACCESSIBLE:
                return {
                    textColor: "text-green-500",
                    backgroundColor: "bg-green-100",
                };
            case CompetitionLevel.UNCLASSIFIED:
                return {
                    textColor: "text-gray-500",
                    backgroundColor: "bg-gray-100",
                };
            default:
                return {
                    textColor: "text-black",
                    backgroundColor: "bg-white",
                };
        }
    }, [level])
}
