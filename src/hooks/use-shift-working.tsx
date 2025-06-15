import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShiftWorkingDetails } from '@/models/models';
import { CreateShiftWorkingRequest, PaginationResponse, UpdateMedicalRoomRequest, UpdateShiftWorkingRequest } from '@/utils/types';

export const useGetShiftWorkings = () => {
    const [shiftWorkings, setShiftWorkings] = useState<ShiftWorkingDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<ShiftWorkingDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchShiftWorkings = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<ShiftWorkingDetails>>('/shifts');
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
    }, []);

    return { shiftWorkings, pagination, loading, refetch: fetchShiftWorkings };
}

export const createShiftWorking = async (data: CreateShiftWorkingRequest) => {
    return await api.post('/shifts', data)
}

export const updateShiftWorking = async (id: string, data: UpdateShiftWorkingRequest) => {
    return await api.put(`/shifts/${id}`, data)
}

export const deleteShiftWorking = async (id: string) => {
    return await api.delete(`/shifts/${id}`);
}