import { useEffect, useState } from 'react';
import api from '../api/axios';
import { PatientWithDetails } from '@/models/models';
import { GetPatientsRequest, PaginationResponse } from '@/utils/types';

export const useGetPatients = (params: GetPatientsRequest) => {
    const [patients, setPatients] = useState<PatientWithDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<PatientWithDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<PatientWithDetails>>('/patients', {
                params
            });
            console.log("Patients fetched successfully:", res.data);
            const patientsData = res.data.data || [];
            setPatients(patientsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching patients:", err);
            setPatients([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [JSON.stringify(params)]);

    return { patients, pagination, loading, refetch: fetchPatients };
}