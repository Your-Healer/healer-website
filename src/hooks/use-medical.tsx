import { useEffect, useState } from 'react';
import api from '../api/axios';
import { MedicalRoomTimeWithDetails, MedicalRoomWithDetails } from '@/models/models';
import { CreateMedicalRoomTimeRequest, GetMedicalRoomRequest, GetTimeSlotsRequest, PaginationResponse } from '@/utils/types';

export const useGetMedicalRooms = (params: GetMedicalRoomRequest) => {
    const [medicalRooms, setMedicalRooms] = useState<MedicalRoomWithDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<MedicalRoomWithDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMedicalRooms = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<MedicalRoomWithDetails>>('/medical/rooms', {
                params
            });
            console.log("Medical rooms fetched successfully:", res.data);
            const medicalRoomsData = res.data.data || [];
            setMedicalRooms(medicalRoomsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching medical rooms:", err);
            setMedicalRooms([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicalRooms();
    }, [JSON.stringify(params)]);

    return { medicalRooms, pagination, loading, refetch: fetchMedicalRooms };
}

export const createMedicalRoom = async (data: {}) => {
    return await api.post('/medical/rooms', data);
}

export const updateMedicalRoom = async (id: string, data: {}) => {
    return await api.put(`/medical/rooms/${id}`, data);
}

export const deleteMedicalRoom = async (id: string) => {
    return await api.delete(`/medical/rooms/${id}`);
}

export const useGetTimeSlots = (params: GetTimeSlotsRequest) => {
    const [timeSlots, setTimeSlots] = useState<MedicalRoomTimeWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationResponse<MedicalRoomTimeWithDetails>['meta'] | null>(null);

    const fetchTimeSlots = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<MedicalRoomTimeWithDetails>>('/medical/slots', { params });
            console.log("Time slots fetched successfully:", res.data);
            setTimeSlots(res.data.data || []);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching time slots:", err);
            setTimeSlots([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimeSlots();
    }, [JSON.stringify(params)]);

    return { timeSlots, loading, pagination, refetch: fetchTimeSlots };
}

export const createTimeSlot = async (data: CreateMedicalRoomTimeRequest) => {
    return await api.post('/medical/time-slots', data);
}

