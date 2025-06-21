import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AppointmentWithDetails, ShiftWorkingDetails, PatientWithDetails, StaffWithDetails } from '@/models/models';
import { APPOINTMENTSTATUS } from '@/utils/enum';
import { AdminDashboardStats, ApiResponse, DoctorDashboardStats, RecentActivity } from '@/utils/types';

export const useAdminDashboard = () => {
    const [stats, setStats] = useState<AdminDashboardStats>({
        totalPatients: 0,
        totalStaff: 0,
        totalAppointments: 0,
        todayAppointments: 0,
        totalDepartments: 0,
        totalMedicalRooms: 0,
        monthlyRevenue: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        cancelledAppointments: 0,
        averageWaitTime: 0,
        patientSatisfactionRate: 0,
    });
    const [recentAppointments, setRecentAppointments] = useState<AppointmentWithDetails[]>([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminDashboard = async () => {
        setLoading(true);
        try {
            // Fetch dashboard statistics
            const statsRes = await api.get<ApiResponse<AdminDashboardStats>>('/statistics/admin/dashboard');
            setStats(statsRes.data.data);

            // Fetch recent appointments
            const appointmentsRes = await api.get<{ data: AppointmentWithDetails[] }>('/appointments', {
                params: { limit: 5, page: 1 }
            });
            setRecentAppointments(appointmentsRes.data.data || []);

        } catch (error) {
            console.error("Error fetching admin dashboard:", error);
            // Set mock data for development
            // setStats({
            //     totalPatients: 1234,
            //     totalStaff: 56,
            //     totalAppointments: 2340,
            //     todayAppointments: 89,
            //     totalDepartments: 12,
            //     totalMedicalRooms: 45,
            //     monthlyRevenue: 39800,
            //     completedAppointments: 2156,
            //     pendingAppointments: 125,
            //     cancelledAppointments: 59,
            //     averageWaitTime: 25,
            //     patientSatisfactionRate: 94.2,
            // });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminDashboard();
    }, []);

    return { stats, recentAppointments, recentActivities, loading, refetch: fetchAdminDashboard };
};

export const useDoctorDashboard = (staffId: string) => {
    const [stats, setStats] = useState<DoctorDashboardStats>({
        todayAppointments: 0,
        upcomingAppointments: 0,
        completedToday: 0,
        totalPatients: 0,
        averageConsultationTime: 0,
        currentShifts: 0,
        weeklyHours: 0,
    });
    const [todayAppointments, setTodayAppointments] = useState<AppointmentWithDetails[]>([]);
    const [currentShifts, setCurrentShifts] = useState<ShiftWorkingDetails[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctorDashboard = async () => {
        setLoading(true);
        try {
            // Fetch doctor statistics
            const statsRes = await api.get<ApiResponse<DoctorDashboardStats>>(`/statistics/doctor/dashboard/${staffId}`);
            setStats(statsRes.data.data);

            // Fetch today's appointments
            const today = new Date();
            const appointmentsRes = await api.get<{ data: AppointmentWithDetails[] }>('/appointments', {
                params: {
                    staffId,
                    date: today.toISOString().split('T')[0],
                    limit: 10
                }
            });
            setTodayAppointments(appointmentsRes.data.data || []);

            // Fetch current shifts
            const shiftsRes = await api.get<{ data: ShiftWorkingDetails[] }>('/shifts', {
                params: {
                    staffId,
                    date: today.toISOString().split('T')[0]
                }
            });
            setCurrentShifts(shiftsRes.data.data || []);

        } catch (error) {
            console.error("Error fetching doctor dashboard:", error);
            // Set mock data for development
            setStats({
                todayAppointments: 12,
                upcomingAppointments: 8,
                completedToday: 5,
                totalPatients: 245,
                averageConsultationTime: 28,
                currentShifts: 1,
                weeklyHours: 42,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (staffId) {
            fetchDoctorDashboard();
        }
    }, [staffId]);

    return { stats, todayAppointments, currentShifts, loading, refetch: fetchDoctorDashboard };
};
