import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RagParsedDiseaseData } from "@/utils/types";
import { cn } from "@/lib/utils";

interface DiseaseQuestionsProps {
    diseases: RagParsedDiseaseData[];
    onQuestionPress: (question: string) => void;
}

const DiseaseQuestions: React.FC<DiseaseQuestionsProps> = ({ diseases, onQuestionPress }) => {
    const [expanded, setExpanded] = useState(false);

    if (!diseases || diseases.length === 0) {
        return null;
    }

    const allQuestions = diseases.flatMap(disease =>
        disease.common_questions?.map(q => q.question) || []
    ).filter(Boolean);

    // Remove duplicates and limit to 5 questions
    const uniqueQuestions = Array.from(new Set(allQuestions)).slice(0, 5);

    if (uniqueQuestions.length === 0) {
        return null;
    }

    const displayedQuestions = expanded ? uniqueQuestions : uniqueQuestions.slice(0, 2);

    return (
        <div className="mt-4 border-t border-gray-200 pt-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Câu hỏi liên quan:</p>
            <div className="flex flex-col space-y-2">
                {displayedQuestions.map((question, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="text-xs justify-start h-auto py-1.5 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => onQuestionPress(question)}
                    >
                        {question}
                    </Button>
                ))}
            </div>

            {uniqueQuestions.length > 2 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        "text-xs mt-1 flex items-center text-gray-500 hover:text-gray-700",
                        "px-2 py-1 h-auto"
                    )}
                >
                    {expanded ? (
                        <>Thu gọn <ChevronUp className="ml-1 h-3 w-3" /></>
                    ) : (
                        <>Xem thêm {uniqueQuestions.length - 2} câu hỏi <ChevronDown className="ml-1 h-3 w-3" /></>
                    )}
                </Button>
            )}
        </div>
    );
};

export default DiseaseQuestions;