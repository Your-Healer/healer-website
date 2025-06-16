import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Building } from "lucide-react"
import { useGetDepartments } from "@/hooks/use-departments"
import { DepartmentWithDetails } from "@/models/models"

interface SelectDepartmentsProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
}

export function SelectDepartments({
    value,
    onValueChange,
    placeholder = "Chọn khoa",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả khoa",
    label,
}: SelectDepartmentsProps) {
    const { departments, loading } = useGetDepartments({
        page: 1,
        limit: 100, // Get all departments
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
                                <Building className="h-4 w-4" />
                                {allLabel}
                            </div>
                        </SelectItem>
                    )}
                    {departments?.map((department: DepartmentWithDetails) => (
                        <SelectItem key={department.id} value={department.id}>
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <span>{department.name}</span>
                                {department.symbol && (
                                    <span className="text-xs text-gray-500">({department.symbol})</span>
                                )}
                            </div>
                        </SelectItem>
                    ))}
                    {departments?.length === 0 && !loading && (
                        <SelectItem value="no-departments" disabled>
                            Không có khoa nào
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}