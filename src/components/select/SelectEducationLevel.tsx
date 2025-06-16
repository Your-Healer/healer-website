import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"

interface SelectEducationLevelProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
}

export function SelectEducationLevel({
    value,
    onValueChange,
    placeholder = "Chọn trình độ học vấn",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả học vấn",
    label,
}: SelectEducationLevelProps) {
    const educationLevels = [
        { value: "DIPLOMA", label: "Cao đẳng" },
        { value: "ASSOCIATE", label: "Liên thông" },
        { value: "BACHELOR", label: "Cử nhân" },
        { value: "MASTER", label: "Thạc sĩ" },
        { value: "PROFESSIONAL", label: "Chuyên nghiệp" },
    ]

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger className={className}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {includeAll && (
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                {allLabel}
                            </div>
                        </SelectItem>
                    )}
                    {educationLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                <span>{level.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

// Helper function to get education level display name
export function getEducationLevelName(level?: string) {
    if (!level || level === "all") return "Tất cả học vấn"

    switch (level) {
        case "DIPLOMA": return "Cao đẳng";
        case "ASSOCIATE": return "Liên thông";
        case "BACHELOR": return "Cử nhân";
        case "MASTER": return "Thạc sĩ";
        case "PROFESSIONAL": return "Chuyên nghiệp";
        default: return "Không xác định";
    }
}
