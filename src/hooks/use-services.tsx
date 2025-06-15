import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ServiceWithDetails } from '@/models/models';
import { PaginationResponse } from '@/utils/types';

interface GetServicesRequest {
    page: number;
    limit: number;
    searchTerm?: string;
}

export const useGetServices = (params: GetServicesRequest) => {
    const [services, setServices] = useState<ServiceWithDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<ServiceWithDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<ServiceWithDetails>>('/services', {
                params
            });
            console.log("Dịch vụ được lấy thành công:", res.data);
            const servicesData = res.data.data || [];
            setServices(servicesData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Lỗi khi lấy dịch vụ:", err);
            setServices([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [JSON.stringify(params)]);

    return { services, pagination, loading, refetch: fetchServices };
}

export const createService = async (data: {
    name: string;
    description?: string;
    durationTime: number;
    price: number;
}) => {
    return await api.post('/services', data)
}

export const updateService = async (id: string, data: {
    name?: string;
    description?: string;
    durationTime?: number;
    price?: number;
}) => {
    return await api.put(`/services/${id}`, data)
}

export const deleteService = async (id: string) => {
    return await api.delete(`/services/${id}`)
}