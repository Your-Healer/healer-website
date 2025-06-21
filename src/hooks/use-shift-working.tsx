import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShiftWorkingDetails } from '@/models/models';
import { GetShiftWorkingRequest, PaginationResponse, CreateShiftWorkingRequest, UpdateShiftWorkingRequest, GetShiftWorkingStatisticsRequest } from '@/utils/types';

export const useGetShiftWorkings = (params: GetShiftWorkingRequest) => {
    const [shiftWorkings, setShiftWorkings] = useState<ShiftWorkingDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<ShiftWorkingDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchShiftWorkings = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<ShiftWorkingDetails>>('/shifts', {
                params
            });
            console.log("Shift workings fetched successfully:", res.data);
            const shiftWorkingsData = res.data.data || [];
            setShiftWorkings(shiftWorkingsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching shift workings:", err);
            setShiftWorkings([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShiftWorkings();
    }, [JSON.stringify(params)]);

    return { shiftWorkings, pagination, loading, refetch: fetchShiftWorkings };
}

export const useCreateShiftWorking = () => {
    const [loading, setLoading] = useState(false);

    const createShiftWorking = async (data: CreateShiftWorkingRequest) => {
        setLoading(true);
        try {
            const res = await api.post<ShiftWorkingDetails>('/shifts', data);
            console.log("Shift working created successfully:", res.data);
            return res.data;
        } catch (err) {
            console.error("Error creating shift working:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createShiftWorking, loading };
}

export const useUpdateShiftWorking = () => {
    const [loading, setLoading] = useState(false);

    const updateShiftWorking = async (id: string, data: UpdateShiftWorkingRequest) => {
        setLoading(true);
        try {
            const res = await api.put<ShiftWorkingDetails>(`/shifts/${id}`, data);
            console.log("Shift working updated successfully:", res.data);
            return res.data;
        } catch (err) {
            console.error("Error updating shift working:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateShiftWorking, loading };
}

export const useDeleteShiftWorking = () => {
    const [loading, setLoading] = useState(false);

    const deleteShiftWorking = async (id: string) => {
        setLoading(true);
        try {
            await api.delete(`/shifts/${id}`);
            console.log("Shift working deleted successfully");
        } catch (err) {
            console.error("Error deleting shift working:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteShiftWorking, loading };
}

export const useGetShiftWorkingStatistics = (params: GetShiftWorkingStatisticsRequest) => {
    const [statistics, setStatistics] = useState<{
        total: number;
        active: number;
        upcoming: number;
        completed: number;
        averageHoursPerWeek: number;
        utilizationRate: number;
    }>({
        total: 0,
        active: 0,
        upcoming: 0,
        completed: 0,
        averageHoursPerWeek: 0,
        utilizationRate: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const res = await api.get<{ statistics: typeof statistics }>('/shifts/statistics', {
                params
            });
            console.log("Shift working statistics fetched successfully:", res.data);
            setStatistics(res.data.statistics);
        } catch (err) {
            console.error("Error fetching shift working statistics:", err);
            setStatistics({
                total: 0,
                active: 0,
                upcoming: 0,
                completed: 0,
                averageHoursPerWeek: 0,
                utilizationRate: 0
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [JSON.stringify(params)]);

    return { statistics, loading, refetch: fetchStatistics };
}