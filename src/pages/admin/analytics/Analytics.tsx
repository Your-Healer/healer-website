"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PDFExportButton } from "@/components/analytics/PdfExportButton"
import { BarChart3, TrendingUp, Calendar, DollarSign, Users, Activity, Filter } from "lucide-react"
import { useSession } from "@/contexts/SessionProvider"

export default function AnalyticsPage() {
    const { user } = useSession()
    const [selectedYear, setSelectedYear] = useState("2024")
    const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly")

    const currentYearTotal = monthlyData.reduce(
        (acc, month) => ({
            appointments: acc.appointments + month.appointments,
            revenue: acc.revenue + month.revenue,
            patients: acc.patients + month.patients,
        }),
        { appointments: 0, revenue: 0, patients: 0 },
    )

    const lastMonthData = monthlyData[monthlyData.length - 2]
    const currentMonthData = monthlyData[monthlyData.length - 1]

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    const calculateGrowth = (current: number, previous: number) => {
        const growth = ((current - previous) / previous) * 100
        return growth.toFixed(1)
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userRole={user?.role || "admin"} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                                <p className="text-gray-600">Track appointments, revenue, and performance metrics</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <PDFExportButton
                                    currentView={currentView}
                                    selectedYear={selectedYear}
                                    monthlyData={monthlyData}
                                    yearlyData={yearlyData}
                                    totalStats={currentYearTotal}
                                />
                                <Button variant="outline">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{currentYearTotal.appointments.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">
                                        +{calculateGrowth(currentMonthData?.appointments || 0, lastMonthData?.appointments || 0)}%
                                    </span>{" "}
                                    from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(currentYearTotal.revenue)}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">
                                        +{calculateGrowth(currentMonthData?.revenue ?? 0, lastMonthData?.revenue ?? 0)}%
                                    </span>{" "}
                                    from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{currentYearTotal.patients.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">
                                        +{calculateGrowth(currentMonthData?.patients ?? 0, lastMonthData?.patients ?? 0)}%
                                    </span>{" "}
                                    from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Revenue per Appointment</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(currentYearTotal.revenue / currentYearTotal.appointments)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+2.1%</span> from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts and Analytics */}
                    <Tabs
                        defaultValue="monthly"
                        onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="monthly">Monthly View</TabsTrigger>
                                <TabsTrigger value="yearly">Yearly View</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-4">
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value="monthly" className="space-y-6">
                            {/* Monthly Appointments Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Appointments</CardTitle>
                                    <CardDescription>Number of appointments per month in {selectedYear}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div id="monthly-appointments-chart" className="h-80 w-full">
                                        <div className="flex items-end justify-between h-64 px-4 py-4 bg-gray-50 rounded-lg">
                                            {monthlyData.map((data, index) => (
                                                <div key={data.month} className="flex flex-col items-center gap-2">
                                                    <div className="text-xs font-medium">{data.appointments}</div>
                                                    <div
                                                        className="bg-blue-500 rounded-t-sm min-w-[20px] transition-all hover:bg-blue-600"
                                                        style={{
                                                            height: `${(data.appointments / Math.max(...monthlyData.map((d) => d.appointments))) * 200}px`,
                                                        }}
                                                    />
                                                    <div className="text-xs text-gray-600">{data.month}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Monthly Revenue Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Revenue</CardTitle>
                                    <CardDescription>Revenue generated per month in {selectedYear}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div id="monthly-revenue-chart" className="h-80 w-full">
                                        <div className="flex items-end justify-between h-64 px-4 py-4 bg-gray-50 rounded-lg">
                                            {monthlyData.map((data, index) => (
                                                <div key={data.month} className="flex flex-col items-center gap-2">
                                                    <div className="text-xs font-medium">{formatCurrency(data.revenue)}</div>
                                                    <div
                                                        className="bg-green-500 rounded-t-sm min-w-[20px] transition-all hover:bg-green-600"
                                                        style={{
                                                            height: `${(data.revenue / Math.max(...monthlyData.map((d) => d.revenue))) * 200}px`,
                                                        }}
                                                    />
                                                    <div className="text-xs text-gray-600">{data.month}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Monthly Detailed Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Performance Details</CardTitle>
                                    <CardDescription>Detailed breakdown of monthly metrics</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2">Month</th>
                                                    <th className="text-right py-2">Appointments</th>
                                                    <th className="text-right py-2">Revenue</th>
                                                    <th className="text-right py-2">Patients</th>
                                                    <th className="text-right py-2">Avg. per Appointment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monthlyData.map((data, index) => (
                                                    <tr key={data.month} className="border-b">
                                                        <td className="py-2 font-medium">
                                                            {data.month} {selectedYear}
                                                        </td>
                                                        <td className="text-right py-2">{data.appointments}</td>
                                                        <td className="text-right py-2">{formatCurrency(data.revenue)}</td>
                                                        <td className="text-right py-2">{data.patients}</td>
                                                        <td className="text-right py-2">{formatCurrency(data.revenue / data.appointments)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="yearly" className="space-y-6">
                            {/* Yearly Appointments Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Yearly Appointments Trend</CardTitle>
                                    <CardDescription>Total appointments per year</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div id="yearly-appointments-chart" className="h-80 w-full">
                                        <div className="flex items-end justify-between h-64 px-4 py-4 bg-gray-50 rounded-lg">
                                            {yearlyData.map((data, index) => (
                                                <div key={data.year} className="flex flex-col items-center gap-2">
                                                    <div className="text-xs font-medium">{data.appointments.toLocaleString()}</div>
                                                    <div
                                                        className="bg-purple-500 rounded-t-sm min-w-[40px] transition-all hover:bg-purple-600"
                                                        style={{
                                                            height: `${(data.appointments / Math.max(...yearlyData.map((d) => d.appointments))) * 200}px`,
                                                        }}
                                                    />
                                                    <div className="text-xs text-gray-600">{data.year}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Yearly Revenue Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Yearly Revenue Trend</CardTitle>
                                    <CardDescription>Total revenue per year</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div id="yearly-revenue-chart" className="h-80 w-full">
                                        <div className="flex items-end justify-between h-64 px-4 py-4 bg-gray-50 rounded-lg">
                                            {yearlyData.map((data, index) => (
                                                <div key={data.year} className="flex flex-col items-center gap-2">
                                                    <div className="text-xs font-medium">{formatCurrency(data.revenue)}</div>
                                                    <div
                                                        className="bg-orange-500 rounded-t-sm min-w-[40px] transition-all hover:bg-orange-600"
                                                        style={{
                                                            height: `${(data.revenue / Math.max(...yearlyData.map((d) => d.revenue))) * 200}px`,
                                                        }}
                                                    />
                                                    <div className="text-xs text-gray-600">{data.year}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Yearly Growth Analysis */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Year-over-Year Growth</CardTitle>
                                        <CardDescription>Growth rates compared to previous year</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {yearlyData.slice(1).map((data, index) => {
                                                const previousYear = yearlyData[index]
                                                const appointmentGrowth = calculateGrowth(data.appointments, previousYear?.appointments ?? 0)
                                                const revenueGrowth = calculateGrowth(data.revenue, previousYear?.revenue ?? 0)

                                                return (
                                                    <div key={data.year} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{data.year}</p>
                                                            <p className="text-sm text-gray-600">vs {previousYear?.year ?? 0}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm">
                                                                Appointments: <span className="text-green-600">+{appointmentGrowth}%</span>
                                                            </p>
                                                            <p className="text-sm">
                                                                Revenue: <span className="text-green-600">+{revenueGrowth}%</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Performance Summary</CardTitle>
                                        <CardDescription>Key insights and trends</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-blue-900">Best Performing Year</span>
                                                </div>
                                                <p className="text-sm text-blue-800">
                                                    2024 shows the highest revenue of {formatCurrency(412300)} with 4,123 appointments
                                                </p>
                                            </div>

                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Activity className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium text-green-900">Growth Trend</span>
                                                </div>
                                                <p className="text-sm text-green-800">
                                                    Consistent year-over-year growth in both appointments and revenue
                                                </p>
                                            </div>

                                            <div className="p-3 bg-purple-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <BarChart3 className="h-4 w-4 text-purple-600" />
                                                    <span className="font-medium text-purple-900">Average Growth</span>
                                                </div>
                                                <p className="text-sm text-purple-800">
                                                    Average annual growth rate of 12.5% in appointments and 13.2% in revenue
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    )
}
