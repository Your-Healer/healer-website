import { useEffect, useState } from 'react';
import api from '../api/axios';
import { StaffWithDetails } from '@/models/models';
import { GetAllStaffs, PaginationResponse } from '@/utils/types';

export const useGetStaffs = (params: GetAllStaffs) => {
    const [staffs, setStaffs] = useState<StaffWithDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<StaffWithDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStaffs = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<StaffWithDetails>>('/staffs', {
                params
            });
            console.log("Staffs fetched successfully:", res.data);
            const staffsData = res.data.data || [];
            setStaffs(staffsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching staffs:", err);
            setStaffs([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffs();
    }, [JSON.stringify(params)]);

    return { staffs, pagination, loading, refetch: fetchStaffs };
}