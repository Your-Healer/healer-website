import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Position } from '@/models/models';
import { PaginationResponse } from '@/utils/types';

interface GetPositionsRequest {
    page: number;
    limit: number;
    searchTerm?: string;
}

export const useGetPositions = (params: GetPositionsRequest) => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<Position>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<Position>>('/positions', {
                params
            });
            console.log("Positions fetched successfully:", res.data);
            const positionsData = res.data.data || [];
            setPositions(positionsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching positions:", err);
            setPositions([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, [JSON.stringify(params)]);

    return { positions, pagination, loading, refetch: fetchPositions };
}

export const useGetPositionById = (id: string) => {
    const [position, setPosition] = useState<Position | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        api.get(`/positions/${id}`)
            .then(res => setPosition(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    return { position, loading };
}

export const createPosition = async (data: Partial<Position>) => {
    return await api.post('/positions', data);
}

export const updatePosition = async (id: string, data: Partial<Position>) => {
    return await api.put(`/positions/${id}`, data);
}

export const deletePosition = async (id: string) => {
    return await api.delete(`/positions/${id}`);
}
