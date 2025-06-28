import api from "@/api/axios";
import { AppointmentWithDetails } from "@/models/models";
import { AppointmentFilter, CreateAppointmentRequest, GetAppointmentsRequest, GetPatientAppointmentHistoryRequest, PaginationResponse } from "@/utils/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { APPOINTMENTSTATUS } from "@/utils/enum";
import { AddDiagnosisSuggestionRequest } from '../utils/types';

export const useGetAppointments = (params: GetAppointmentsRequest) => {
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationResponse<AppointmentWithDetails>['meta'] | null>(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<AppointmentWithDetails>>('/appointments', {
                params
            });
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

export const useGetAppointmentStatistics = (params: AppointmentFilter) => {
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

export const useGetPatientAppointmentHistory = (patientId: string, params: GetPatientAppointmentHistoryRequest) => {
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationResponse<AppointmentWithDetails>['meta'] | null>(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<AppointmentWithDetails>>(`/appointments/${patientId}/history`, {
                params
            });
            console.log("Patient appointment history fetched successfully:", res.data);
            const appointmentsData = res.data.data || [];
            setAppointments(appointmentsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching patient appointment history:", err);
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

export const useGetAppointmentById = (appointmentId: string) => {
    const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchAppointment = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get<AppointmentWithDetails>(`/appointments/${appointmentId}`);
            console.log("Appointment fetched successfully:", res.data);
            setAppointment(res.data);
        } catch (err) {
            console.error("Error fetching appointment:", err);
            setError("Failed to fetch appointment details");
            setAppointment(null);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (appointmentId) {
            fetchAppointment();
        } else {
            setAppointment(null);
            setLoading(false);
            setError("Appointment ID is required");
        }
    }, [appointmentId]);
    return { appointment, loading, error, refetch: fetchAppointment };
}

export const createNewAppointment = async (body: CreateAppointmentRequest) => {
    return await api.post('/appointments', body);
}

export const completeAppointment = async (appointmentId: string) => {
    return await api.patch(`/appointments/${appointmentId}/complete`);
}

export const cancelAppointment = async (appointmentId: string) => {
    return await api.patch(`/appointments/${appointmentId}/cancel`);
}

export const updateAppointmentStatus = async (appointmentId: string, status: APPOINTMENTSTATUS) => {
    return await api.patch(`/appointments/${appointmentId}/status`, { status });
}

export const addDiagnosisSuggestion = async (appointmentId: string, data: AddDiagnosisSuggestionRequest) => {
    return await api.post(`/appointments/${appointmentId}/diagnosis`, data);
}
