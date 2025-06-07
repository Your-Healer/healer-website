import { useEffect, useState } from 'react';
import api from '../api/axios';

export const useGetDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/departments')
            .then(res => setDepartments(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return { departments, loading };
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