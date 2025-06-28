"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Brain, UserCheck, Target, Stethoscope } from "lucide-react";
import { AppointmentWithDetails } from "@/models/models";
import { convertToVietnameseDate } from "@/lib/utils";

interface DiagnosisTabProps {
    appointment: AppointmentWithDetails;
    canModifyAppointment: boolean;
    isSubmitting: boolean;
    onAddDiagnosis: () => void;
}

export function DiagnosisTab({
    appointment,
    canModifyAppointment,
    isSubmitting,
    onAddDiagnosis
}: DiagnosisTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Gợi ý chẩn đoán</h3>
                {canModifyAppointment && (
                    <Button size="sm" onClick={onAddDiagnosis} disabled={isSubmitting}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm chẩn đoán
                    </Button>
                )}
            </div>

            {appointment.suggestions.length > 0 ? (
                <div className="grid gap-4">
                    {appointment.suggestions.map((suggestion, index) => (
                        <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant="outline" className="gap-1">
                                                {suggestion.suggestedByAI ? (
                                                    <Brain className="h-3 w-3" />
                                                ) : (
                                                    <UserCheck className="h-3 w-3" />
                                                )}
                                                {suggestion.suggestedByAI ? "AI" : "Thủ công"}
                                            </Badge>
                                            <Badge variant="secondary" className="gap-1">
                                                <Target className="h-3 w-3" />
                                                {(suggestion.confidence * 100).toFixed(1)}%
                                            </Badge>
                                        </div>
                                        <h4 className="font-medium mb-1">{suggestion.disease}</h4>
                                        {suggestion.description && (
                                            <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                                        )}
                                        {suggestion.suggestedByAI && (
                                            <div className="bg-blue-50 p-2 rounded-lg mb-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Brain className="h-3 w-3 text-blue-600" />
                                                    <span className="font-medium text-sm text-blue-800">Gợi ý từ AI</span>
                                                </div>
                                                <p className="text-sm text-blue-700">{suggestion.suggestedByAI}</p>
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            {convertToVietnameseDate(suggestion.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có gợi ý chẩn đoán</h3>
                    <p className="text-gray-500 mb-4">
                        Chưa có gợi ý chẩn đoán nào cho lịch hẹn này.
                    </p>
                    {canModifyAppointment && (
                        <Button onClick={onAddDiagnosis}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm chẩn đoán đầu tiên
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
