import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AppointmentWithDetails, ShiftWorkingDetails, PatientWithDetails, StaffWithDetails } from '@/models/models';
import { APPOINTMENTSTATUS } from '@/utils/enum';
import { AdminDashboardStats, ApiResponse, DoctorDashboardStats, RecentActivity } from '@/utils/types';

export const useAdminDashboard = () => {
    const [stats, setStats] = useState<AdminDashboardStats>({
        totalPatients: 0,
        totalStaff: 0,
        totalDepartments: 0,
        totalMedicalRooms: 0,
        appointments: {
            total: 0,
            today: {
                count: 0,
                idle: 0,
                booked: 0,
                paid: 0,
                cancel: 0,
                finished: 0
            },
            monthlyData: []
        },
        revenue: {
            total: 0,
            today: 0,
            monthly: 0,
            monthlyData: []
        }
    });
    const [loading, setLoading] = useState(true);

    const fetchAdminDashboard = async () => {
        setLoading(true);
        try {
            const statsRes = await api.get<ApiResponse<AdminDashboardStats>>('/statistics/admin/dashboard');
            setStats(statsRes.data.data);
        } catch (error) {
            console.error("Error fetching admin dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminDashboard();
    }, []);

    return { stats, loading, refetch: fetchAdminDashboard };
};

export const useDoctorDashboard = (staffId: string) => {
    const [stats, setStats] = useState<DoctorDashboardStats>({
        appointments: {
            total: 0,
            today: {
                count: 0,
                idle: 0,
                booked: 0,
                paid: 0,
                cancel: 0,
                finished: 0
            },
            monthlyData: []
        },
        shifts: {
            total: 0,
            monthlyData: [],
            weeklyHours: {
                week: '',
                hours: 0
            }
        }
    });
    const [loading, setLoading] = useState(true);

    const fetchDoctorDashboard = async () => {
        setLoading(true);
        try {
            const statsRes = await api.get<ApiResponse<DoctorDashboardStats>>(`/statistics/doctor/dashboard`);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error("Error fetching doctor dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (staffId) {
            fetchDoctorDashboard();
        }
    }, [staffId]);

    return { stats, loading, refetch: fetchDoctorDashboard };
};
