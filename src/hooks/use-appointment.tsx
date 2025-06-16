import api from "@/api/axios";
import { AppointmentWithDetails } from "@/models/models";
import { AppointmentFilter, GetAppointmentsRequest, PaginationResponse } from "@/utils/types";
import { useEffect, useState } from "react";

export const getAppointments = (params: GetAppointmentsRequest) => {
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationResponse<AppointmentWithDetails>['meta'] | null>(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<AppointmentWithDetails>>('/appointments', {
                params
            });
            console.log("Appointments fetched successfully:", res.data);
            const appointmentsData = res.data.data || [];
            setAppointments(appointmentsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setAppointments([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, [JSON.stringify(params)])
    return { appointments, loading, pagination, refetch: fetchAppointments };
}

export const getAppointmentStatistics = (params: AppointmentFilter) => {
    const [statistics, setStatistics] = useState<{
        total: number;
        booked: number;
        paid: number;
        cancelled: number;
        completionRate: number;
        cancellationRate: number;
    }>({
        total: 0,
        booked: 0,
        paid: 0,
        cancelled: 0,
        completionRate: 0,
        cancellationRate: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const res = await api.get<{ statistics: typeof statistics }>('/appointments/statistics', {
                params
            });
            console.log("Appointment statistics fetched successfully:", res.data);
            setStatistics(res.data.statistics);
        } catch (err) {
            console.error("Error fetching appointment statistics:", err);
            setStatistics({
                total: 0,
                booked: 0,
                paid: 0,
                cancelled: 0,
                completionRate: 0,
                cancellationRate: 0
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStatistics();
    }, [JSON.stringify(params)]);

    return { statistics, loading, refetch: fetchStatistics };
}

// export const createNewAppointment = async(appointment)