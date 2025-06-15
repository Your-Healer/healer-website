import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Shield, UserCheck, Users } from "lucide-react"

interface SelectAccountRoleProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
}

export function SelectAccountRole({
    value,
    onValueChange,
    placeholder = "Chọn vai trò",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả vai trò",
    label,
}: SelectAccountRoleProps) {
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
                                <Users className="h-4 w-4" />
                                {allLabel}
                            </div>
                        </SelectItem>
                    )}
                    <SelectItem value="1">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Quản trị viên
                        </div>
                    </SelectItem>
                    <SelectItem value="2">
                        <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Nhân viên
                        </div>
                    </SelectItem>
                    <SelectItem value="3">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Người dùng
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

// Helper function to get role display name
export function getAccountRoleName(roleId?: string) {
    if (!roleId || roleId === "all") return "Tất cả vai trò"

    switch (roleId) {
        case "1": return "Quản trị viên";
        case "2": return "Nhân viên";
        case "3": return "Người dùng";
        default: return "Không xác định";
    }
}
