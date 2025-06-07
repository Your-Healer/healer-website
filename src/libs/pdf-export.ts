import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface MonthlyData {
	month: string;
	appointments: number;
	revenue: number;
	patients: number;
}

interface YearlyData {
	year: string;
	appointments: number;
	revenue: number;
	patients: number;
}

interface ExportData {
	type: "monthly" | "yearly";
	year: string;
	monthlyData?: MonthlyData[];
	yearlyData?: YearlyData[];
	totalStats: {
		appointments: number;
		revenue: number;
		patients: number;
	};
}

export class PDFExporter {
	private pdf: jsPDF;
	private pageWidth: number;
	private pageHeight: number;
	private margin: number;
	private currentY: number;

	constructor() {
		this.pdf = new jsPDF("p", "mm", "a4");
		this.pageWidth = this.pdf.internal.pageSize.getWidth();
		this.pageHeight = this.pdf.internal.pageSize.getHeight();
		this.margin = 20;
		this.currentY = this.margin;
	}

	private formatCurrency(amount: number): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	}

	private formatDate(): string {
		return new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	private addHeader(title: string, subtitle: string) {
		// Logo/Header area
		this.pdf.setFillColor(59, 130, 246); // Blue color
		this.pdf.rect(0, 0, this.pageWidth, 30, "F");

		// Title
		this.pdf.setTextColor(255, 255, 255);
		this.pdf.setFontSize(20);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text("Your Healer System", this.margin, 15);

		// Subtitle
		this.pdf.setFontSize(12);
		this.pdf.setFont("helvetica", "normal");
		this.pdf.text(title, this.margin, 22);

		// Date
		this.pdf.text(
			`Generated: ${this.formatDate()}`,
			this.pageWidth - this.margin - 50,
			15
		);

		this.currentY = 40;

		// Report title
		this.pdf.setTextColor(0, 0, 0);
		this.pdf.setFontSize(16);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text(subtitle, this.margin, this.currentY);
		this.currentY += 15;
	}

	private addFooter() {
		const footerY = this.pageHeight - 15;
		this.pdf.setFontSize(8);
		this.pdf.setFont("helvetica", "normal");
		this.pdf.setTextColor(128, 128, 128);
		this.pdf.text("Your Healer Analytics Report", this.margin, footerY);
		this.pdf.text(
			`Page ${this.pdf.getCurrentPageInfo().pageNumber}`,
			this.pageWidth - this.margin - 20,
			footerY
		);
	}

	private addKeyMetrics(stats: {
		appointments: number;
		revenue: number;
		patients: number;
	}) {
		this.pdf.setFontSize(14);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text("Key Performance Metrics", this.margin, this.currentY);
		this.currentY += 10;

		// Create metrics boxes
		const boxWidth = (this.pageWidth - 2 * this.margin - 20) / 3;
		const boxHeight = 25;
		const startX = this.margin;

		// Appointments box
		this.pdf.setFillColor(239, 246, 255); // Light blue
		this.pdf.rect(startX, this.currentY, boxWidth, boxHeight, "F");
		this.pdf.setDrawColor(59, 130, 246);
		this.pdf.rect(startX, this.currentY, boxWidth, boxHeight, "S");

		this.pdf.setFontSize(10);
		this.pdf.setFont("helvetica", "normal");
		this.pdf.text("Total Appointments", startX + 5, this.currentY + 8);
		this.pdf.setFontSize(16);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text(
			stats.appointments.toLocaleString(),
			startX + 5,
			this.currentY + 18
		);

		// Revenue box
		this.pdf.setFillColor(240, 253, 244); // Light green
		this.pdf.rect(
			startX + boxWidth + 10,
			this.currentY,
			boxWidth,
			boxHeight,
			"F"
		);
		this.pdf.setDrawColor(34, 197, 94);
		this.pdf.rect(
			startX + boxWidth + 10,
			this.currentY,
			boxWidth,
			boxHeight,
			"S"
		);

		this.pdf.setFontSize(10);
		this.pdf.setFont("helvetica", "normal");
		this.pdf.text("Total Revenue", startX + boxWidth + 15, this.currentY + 8);
		this.pdf.setFontSize(16);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text(
			this.formatCurrency(stats.revenue),
			startX + boxWidth + 15,
			this.currentY + 18
		);

		// Patients box
		this.pdf.setFillColor(254, 243, 199); // Light yellow
		this.pdf.rect(
			startX + 2 * boxWidth + 20,
			this.currentY,
			boxWidth,
			boxHeight,
			"F"
		);
		this.pdf.setDrawColor(245, 158, 11);
		this.pdf.rect(
			startX + 2 * boxWidth + 20,
			this.currentY,
			boxWidth,
			boxHeight,
			"S"
		);

		this.pdf.setFontSize(10);
		this.pdf.setFont("helvetica", "normal");
		this.pdf.text(
			"Total Patients",
			startX + 2 * boxWidth + 25,
			this.currentY + 8
		);
		this.pdf.setFontSize(16);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text(
			stats.patients.toLocaleString(),
			startX + 2 * boxWidth + 25,
			this.currentY + 18
		);

		this.currentY += boxHeight + 20;
	}

	private addMonthlyTable(data: MonthlyData[], year: string) {
		this.pdf.setFontSize(14);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text(`Monthly Performance - ${year}`, this.margin, this.currentY);
		this.currentY += 15;

		// Table headers
		const colWidths = [30, 35, 45, 30, 40];
		const headers = [
			"Month",
			"Appointments",
			"Revenue",
			"Patients",
			"Avg/Appointment",
		];

		this.pdf.setFillColor(248, 250, 252);
		this.pdf.rect(
			this.margin,
			this.currentY,
			this.pageWidth - 2 * this.margin,
			8,
			"F"
		);

		this.pdf.setFontSize(10);
		this.pdf.setFont("helvetica", "bold");
		let currentX = this.margin + 2;

		headers.forEach((header, index) => {
			this.pdf.text(header, currentX, this.currentY + 6);
			currentX += colWidths[index];
		});

		this.currentY += 8;

		// Table rows
		this.pdf.setFont("helvetica", "normal");
		data.forEach((row, index) => {
			if (this.currentY > this.pageHeight - 40) {
				this.pdf.addPage();
				this.currentY = this.margin;
			}

			// Alternate row colors
			if (index % 2 === 0) {
				this.pdf.setFillColor(249, 250, 251);
				this.pdf.rect(
					this.margin,
					this.currentY,
					this.pageWidth - 2 * this.margin,
					8,
					"F"
				);
			}

			currentX = this.margin + 2;
			const rowData = [
				`${row.month} ${year}`,
				row.appointments.toString(),
				this.formatCurrency(row.revenue),
				row.patients.toString(),
				this.formatCurrency(row.revenue / row.appointments),
			];

			rowData.forEach((cell, cellIndex) => {
				this.pdf.text(cell, currentX, this.currentY + 6);
				currentX += colWidths[cellIndex];
			});

			this.currentY += 8;
		});

		this.currentY += 10;
	}

	private addYearlyTable(data: YearlyData[]) {
		this.pdf.setFontSize(14);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text("Yearly Performance Trends", this.margin, this.currentY);
		this.currentY += 15;

		// Table headers
		const colWidths = [25, 35, 45, 30, 40, 35];
		const headers = [
			"Year",
			"Appointments",
			"Revenue",
			"Patients",
			"Avg/Appointment",
			"Growth %",
		];

		this.pdf.setFillColor(248, 250, 252);
		this.pdf.rect(
			this.margin,
			this.currentY,
			this.pageWidth - 2 * this.margin,
			8,
			"F"
		);

		this.pdf.setFontSize(10);
		this.pdf.setFont("helvetica", "bold");
		let currentX = this.margin + 2;

		headers.forEach((header, index) => {
			this.pdf.text(header, currentX, this.currentY + 6);
			currentX += colWidths[index];
		});

		this.currentY += 8;

		// Table rows
		this.pdf.setFont("helvetica", "normal");
		data.forEach((row, index) => {
			if (this.currentY > this.pageHeight - 40) {
				this.pdf.addPage();
				this.currentY = this.margin;
			}

			// Alternate row colors
			if (index % 2 === 0) {
				this.pdf.setFillColor(249, 250, 251);
				this.pdf.rect(
					this.margin,
					this.currentY,
					this.pageWidth - 2 * this.margin,
					8,
					"F"
				);
			}

			const previousYear = index > 0 ? data[index - 1] : null;
			const growth = previousYear
				? (
						((row.revenue - previousYear.revenue) / previousYear.revenue) *
						100
					).toFixed(1)
				: "N/A";

			currentX = this.margin + 2;
			const rowData = [
				row.year,
				row.appointments.toLocaleString(),
				this.formatCurrency(row.revenue),
				row.patients.toLocaleString(),
				this.formatCurrency(row.revenue / row.appointments),
				growth !== "N/A" ? `+${growth}%` : growth,
			];

			rowData.forEach((cell, cellIndex) => {
				this.pdf.text(cell, currentX, this.currentY + 6);
				currentX += colWidths[cellIndex];
			});

			this.currentY += 8;
		});

		this.currentY += 10;
	}

	private addSummaryInsights(data: ExportData) {
		if (this.currentY > this.pageHeight - 60) {
			this.pdf.addPage();
			this.currentY = this.margin;
		}

		this.pdf.setFontSize(14);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.text("Key Insights & Summary", this.margin, this.currentY);
		this.currentY += 15;

		const insights = [];

		if (data.type === "monthly" && data.monthlyData) {
			const bestMonth = data.monthlyData.reduce((prev, current) =>
				prev.revenue > current.revenue ? prev : current
			);
			const avgRevenue = data.totalStats.revenue / data.monthlyData.length;

			insights.push(
				`• Best performing month: ${bestMonth.month} with ${this.formatCurrency(bestMonth.revenue)} revenue`,
				`• Average monthly revenue: ${this.formatCurrency(avgRevenue)}`,
				`• Total appointments for the year: ${data.totalStats.appointments.toLocaleString()}`,
				`• Average revenue per appointment: ${this.formatCurrency(data.totalStats.revenue / data.totalStats.appointments)}`
			);
		} else if (data.type === "yearly" && data.yearlyData) {
			const latestYear = data.yearlyData[data.yearlyData.length - 1];
			const firstYear = data.yearlyData[0];
			const totalGrowth = (
				((latestYear.revenue - firstYear.revenue) / firstYear.revenue) *
				100
			).toFixed(1);

			insights.push(
				`• Total growth from ${firstYear.year} to ${latestYear.year}: ${totalGrowth}%`,
				`• Best performing year: ${latestYear.year} with ${this.formatCurrency(latestYear.revenue)}`,
				`• Average annual appointments: ${Math.round(data.yearlyData.reduce((sum, year) => sum + year.appointments, 0) / data.yearlyData.length).toLocaleString()}`,
				`• Consistent year-over-year growth trend observed`
			);
		}

		this.pdf.setFontSize(10);
		this.pdf.setFont("helvetica", "normal");

		insights.forEach((insight) => {
			this.pdf.text(insight, this.margin, this.currentY);
			this.currentY += 6;
		});
	}

	async exportToPDF(data: ExportData): Promise<void> {
		try {
			// Add header
			this.addHeader(
				`${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Analytics Report`,
				`${data.type === "monthly" ? `Monthly Report - ${data.year}` : "Yearly Performance Report"}`
			);

			// Add key metrics
			this.addKeyMetrics(data.totalStats);

			// Add appropriate table
			if (data.type === "monthly" && data.monthlyData) {
				this.addMonthlyTable(data.monthlyData, data.year);
			} else if (data.type === "yearly" && data.yearlyData) {
				this.addYearlyTable(data.yearlyData);
			}

			// Add insights
			this.addSummaryInsights(data);

			// Add footer
			this.addFooter();

			// Save the PDF
			const fileName = `medical-erp-${data.type}-report-${data.year || "all-years"}-${new Date().toISOString().split("T")[0]}.pdf`;
			this.pdf.save(fileName);
		} catch (error) {
			console.error("Error generating PDF:", error);
			throw new Error("Failed to generate PDF report");
		}
	}

	async exportChartToPDF(chartElementId: string, title: string): Promise<void> {
		try {
			const chartElement = document.getElementById(chartElementId);
			if (!chartElement) {
				throw new Error("Chart element not found");
			}

			const canvas = await html2canvas(chartElement, {
				backgroundColor: "#ffffff",
				scale: 2,
			});

			const imgData = canvas.toDataURL("image/png");
			const imgWidth = this.pageWidth - 2 * this.margin;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			this.addHeader("Chart Export", title);

			if (this.currentY + imgHeight > this.pageHeight - 40) {
				this.pdf.addPage();
				this.currentY = this.margin;
			}

			this.pdf.addImage(
				imgData,
				"PNG",
				this.margin,
				this.currentY,
				imgWidth,
				imgHeight
			);
			this.addFooter();

			const fileName = `chart-export-${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
			this.pdf.save(fileName);
		} catch (error) {
			console.error("Error exporting chart:", error);
			throw new Error("Failed to export chart to PDF");
		}
	}
}
