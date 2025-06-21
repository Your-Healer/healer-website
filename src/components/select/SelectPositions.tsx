import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCheck, Users } from "lucide-react"
import { useGetPositions } from "@/hooks/use-positions"
import { Position } from "@/models/models"

interface SelectPositionsProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
}

export function SelectPositions({
    value,
    onValueChange,
    placeholder = "Chọn chức vụ",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả chức vụ"
}: SelectPositionsProps) {
    const { positions, loading } = useGetPositions({
        page: 1,
        limit: 1000, // Get all positions
    })

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={loading ? "Đang tải..." : placeholder} />
            </SelectTrigger>
            <SelectContent>
                {includeAll && (
                    <SelectItem value="all">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {allLabel}
                        </div>
                    </SelectItem>
                )}

                {/* Static positions with custom styling */}
                <SelectItem value="1">
                    <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Bác sĩ
                    </div>
                </SelectItem>
                <SelectItem value="2">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Y tá
                    </div>
                </SelectItem>
                <SelectItem value="3">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Lễ tân
                    </div>
                </SelectItem>
                <SelectItem value="4">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Trưởng khoa
                    </div>
                </SelectItem>

                {/* Dynamic positions from API */}
                {positions?.filter(position => !["1", "2", "3", "4"].includes(position.id)).map((position: Position) => (
                    <SelectItem key={position.id} value={position.id}>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{position.name}</span>
                        </div>
                    </SelectItem>
                ))}

                {positions?.length === 0 && !loading && (
                    <SelectItem value="no-positions" disabled>
                        Không có chức vụ nào
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    )
}

// Helper function to get position name by ID
export function usePositionName(positionId?: string) {
    const { positions } = useGetPositions({
        page: 1,
        limit: 1000,
    })

    const getPositionName = (id?: string) => {
        if (!id) return "Chưa có"

        // Handle static positions
        switch (id) {
            case "1": return "Bác sĩ";
            case "2": return "Y tá";
            case "3": return "Lễ tân";
            case "4": return "Trưởng khoa";
            default: {
                if (!positions) return "Đang tải..."
                const position = positions.find(pos => pos.id === id)
                return position ? position.name : "Không tìm thấy"
            }
        }
    }

    return getPositionName(positionId)
}
