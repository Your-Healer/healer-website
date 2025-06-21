import api from "@/api/axios"
import { useEffect, useState } from "react";

export const setBalances = (addresses: string[], amount: bigint) => {
    return api.post("/blockchain/set-balances", {
        addresses,
        amount: amount.toString(),
    });
}

export const useGetBlockchainPatientsById = (id: string) => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get(`/blockchain/patients/${id}`);
                setPatients(response.data);
            } catch (err) {
                setError("Failed to fetch patients");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [id]);
}

export const useGetBlockchainPatientsByName = (patientName: string) => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get(`/blockchain/patients/`, {
                    params: { patientName }
                });
                setPatients(response.data);
            } catch (err) {
                setError("Failed to fetch patients");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [patientName]);

    return { patients, loading, error };
}