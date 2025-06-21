import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { User, Users } from "lucide-react"
import { StaffWithDetails } from "@/models/models"
import { useEffect, useState } from "react"
import api from "@/api/axios"
import { useGetStaffs } from "@/hooks/use-staffs"
import { GetAllStaffs } from "@/utils/types"
import { EDUCATIONLEVEL } from "@/utils/enum"

interface SelectStaffProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
    departmentId?: string
    positionId?: string
    educationLevel?: EDUCATIONLEVEL
    query?: string
}

export function SelectStaffs({
    value,
    onValueChange,
    placeholder = "Chọn nhân viên",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả nhân viên",
    label,
    departmentId,
    positionId,
    educationLevel,
    query,
}: SelectStaffProps) {
    const { staffs, loading, refetch } = useGetStaffs({
        page: 1,
        limit: 1000,
        departmentId,
        positionId,
        educationLevel,
        query
    })

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
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
                    {staffs.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {`${staff.firstname} ${staff.lastname}`}
                                {staff.positions && staff.positions.length > 0 &&
                                    staff.positions.map((pos, index) => (
                                        (
                                            <span className="text-xs text-gray-500" key={index}>
                                                - {pos.position.name}
                                            </span>
                                        )
                                    ))}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}