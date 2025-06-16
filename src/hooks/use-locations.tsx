import { useEffect, useState } from 'react';
import api from '../api/axios';
import { LocationWithDetails } from '@/models/models';
import { PaginationResponse } from '@/utils/types';

interface GetLocationsRequest {
    page: number;
    limit: number;
    searchTerm?: string;
}

export const useGetLocations = (params: GetLocationsRequest) => {
    const [locations, setLocations] = useState<LocationWithDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<LocationWithDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<LocationWithDetails>>('/locations', {
                params
            });
            console.log("Locations fetched successfully:", res.data);
            const locationsData = res.data.data || [];
            setLocations(locationsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching locations:", err);
            setLocations([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [JSON.stringify(params)]);

    return { locations, pagination, loading, refetch: fetchLocations };
}

export const createLocation = async (data: {
    name: string;
    detail: string;
    street: string;
    city: string;
    country: string;
    lat?: number;
    lng?: number;
}) => {
    return await api.post('/locations', data)
}

export const updateLocation = async (id: string, data: {
    name?: string;
    detail?: string;
    street?: string;
    city?: string;
    country?: string;
    lat?: number;
    lng?: number;
}) => {
    return await api.put(`/locations/${id}`, data)
}

export const deleteLocation = async (id: string) => {
    return await api.delete(`/locations/${id}`)
}
