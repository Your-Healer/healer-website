import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Hospital, Home } from "lucide-react"
import { MedicalRoomWithDetails } from "@/models/models"
import { useEffect, useState } from "react"
import api from "@/api/axios"
import { useGetMedicalRooms } from "@/hooks/use-medical"

interface SelectMedicalRoomProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
    departmentId?: string
}

export function SelectMedicalRoom({
    value,
    onValueChange,
    placeholder = "Chọn phòng khám",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả phòng",
    label,
    departmentId,
}: SelectMedicalRoomProps) {
    const { medicalRooms, loading: medicalRoomsLoading } = useGetMedicalRooms({
        page: 1,
        limit: 1000,
    })

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <Select value={value} onValueChange={onValueChange} disabled={disabled || medicalRoomsLoading}>
                <SelectTrigger className={className}>
                    <SelectValue placeholder={medicalRoomsLoading ? "Đang tải..." : placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {includeAll && (
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                {allLabel}
                            </div>
                        </SelectItem>
                    )}
                    {medicalRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                            <div className="flex items-center gap-2">
                                <Hospital className="h-4 w-4" />
                                <span>{room.name}</span>
                                <span className="text-xs text-gray-500">
                                    - {room.department.name}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}