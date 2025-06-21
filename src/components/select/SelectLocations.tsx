import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import { useGetLocations } from "@/hooks/use-locations"
import { LocationWithDetails } from "@/models/models"

interface SelectLocationsProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    includeAll?: boolean
    allLabel?: string
    label?: string
}

export function SelectLocations({
    value,
    onValueChange,
    placeholder = "Chọn địa điểm",
    className,
    disabled = false,
    includeAll = false,
    allLabel = "Tất cả địa điểm",
    label,
}: SelectLocationsProps) {
    const { locations, loading } = useGetLocations({
        page: 1,
        limit: 1000,
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
                                <MapPin className="h-4 w-4" />
                                {allLabel}
                            </div>
                        </SelectItem>
                    )}
                    {locations?.map((location: LocationWithDetails) => (
                        <SelectItem key={location.id} value={location.id}>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{location.name}</span>
                                <span className="text-xs text-gray-500">({location.city})</span>
                            </div>
                        </SelectItem>
                    ))}
                    {locations?.length === 0 && !loading && (
                        <SelectItem value="no-locations" disabled>
                            Không có địa điểm nào
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}
