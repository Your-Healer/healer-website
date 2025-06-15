import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Stethoscope } from "lucide-react"
import { useGetServices } from "@/hooks/use-services"
import { ServiceWithDetails } from "@/models/models"

interface SelectServicesProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
}

export function SelectServices({
    value,
    onValueChange,
    placeholder = "Chọn dịch vụ",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả dịch vụ",
    label,
}: SelectServicesProps) {
    const { services, loading } = useGetServices({
        page: 1,
        limit: 100, // Get all services
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
                                <Stethoscope className="h-4 w-4" />
                                {allLabel}
                            </div>
                        </SelectItem>
                    )}
                    {services?.map((service: ServiceWithDetails) => (
                        <SelectItem key={service.id} value={service.id}>
                            <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4" />
                                <span>{service.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                    {services?.length === 0 && !loading && (
                        <SelectItem value="no-services" disabled>
                            Không có dịch vụ nào
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}
