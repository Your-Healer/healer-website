import { useEffect, useState } from 'react';
import api from '../api/axios';
import { DepartmentWithDetails } from '@/models/models';
import { GetDepartmentsRequest, PaginationResponse } from '@/utils/types';

export const useGetDepartments = (params: GetDepartmentsRequest) => {
    const [departments, setDepartments] = useState<DepartmentWithDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<DepartmentWithDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<DepartmentWithDetails>>('/departments', {
                params
            });
            console.log("Departments fetched successfully:", res.data);
            const departmentsData = res.data.data || [];
            setDepartments(departmentsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching departments:", err);
            setDepartments([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [JSON.stringify(params)]);

    return { departments, pagination, loading, refetch: fetchDepartments };
}

export const useGetDepartmentById = (id: string) => {
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/departments/${id}`)
            .then(res => setDepartment(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    return { department, loading };
}


export const createDepartment = async (data: {}) => {
    return await api.post('/departments', data)
}

export const updateDepartment = async (id: string, data: {}) => {
    return await api.put(`/departments/${id}`, data)
}

export const deleteDepartment = async (id: string) => {
    return await api.delete(`/departments/${id}`)
}