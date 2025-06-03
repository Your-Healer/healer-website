"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, BarChart3, Loader2 } from "lucide-react"
import { PDFExporter } from "@/libs/pdf-export"
import { toast } from "sonner"

interface MonthlyData {
    month: string
    appointments: number
    revenue: number
    patients: number
}

interface YearlyData {
    year: string
    appointments: number
    revenue: number
    patients: number
}

interface PDFExportButtonProps {
    currentView: "monthly" | "yearly"
    selectedYear: string
    monthlyData: MonthlyData[]
    yearlyData: YearlyData[]
    totalStats: {
        appointments: number
        revenue: number
        patients: number
    }
}

export function PDFExportButton({
    currentView,
    selectedYear,
    monthlyData,
    yearlyData,
    totalStats,
}: PDFExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExportReport = async (type: "monthly" | "yearly") => {
        setIsExporting(true)
        try {
            const exporter = new PDFExporter()

            const exportData = {
                type,
                year: selectedYear,
                monthlyData: type === "monthly" ? monthlyData : undefined,
                yearlyData: type === "yearly" ? yearlyData : undefined,
                totalStats,
            }

            await exporter.exportToPDF(exportData)

            toast.success("Export Successful", {
                description: `${type.charAt(0).toUpperCase() + type.slice(1)} report has been downloaded.`,
            })
        } catch (error) {
            toast.error("Export Failed", {
                description: "There was an error generating the PDF report.",
            })
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportChart = async (chartId: string, title: string) => {
        setIsExporting(true)
        try {
            const exporter = new PDFExporter()
            await exporter.exportChartToPDF(chartId, title)

            toast.success("Chart Exported", {
                description: `Chart "${title}" has been exported to PDF successfully.`,
            })
        } catch (error) {
            toast.error("Chart Export Failed", {
                description: `There was an error exporting the chart "${title}".`,
            })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isExporting}>
                    {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Export Report
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleExportReport("monthly")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Monthly Report ({selectedYear})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportReport("yearly")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Yearly Trends Report
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExportChart("monthly-appointments-chart", "Monthly Appointments Chart")}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Export Appointments Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportChart("monthly-revenue-chart", "Monthly Revenue Chart")}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Export Revenue Chart
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
