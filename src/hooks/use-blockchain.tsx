import api from "@/api/axios"
import { BlockchainDiseaseProgressionWithDetails, BlockchainMedicalRecordWithDetails, BlockchainPatientClinicalTestWithDetails, BlockchainPatientDiseaseProgressionWithDetails, BlockchainPatientMedicalRecordWithDetails, BlockchainPatientWithDetails } from "@/models/models";
import {
    BlockchainCreateClinicalTestRequest,
    BlockchainCreateDiseaseProgressionRequest,
    BlockchainCreateMedicalRecordRequest,
    BlockchainCreatePatientRequest,
    BlockchainDeleteClinicalTestRequest,
    BlockchainResponse,
    BlockchainUpdateClinicalTestRequest,
    BlockchainUpdateDiseaseProgressionRequest,
    BlockchainUpdatePatientRequest
} from "@/utils/types";
import { useEffect, useState } from "react";
import { BlockchainClinicalTestWithDetails } from '../models/models';

export const setBalances = (addresses: string[], amount: bigint) => {
    return api.post("/blockchain/set-balances", {
        addresses,
        amount: amount.toString(),
    });
}

// ==================== PATIENT HOOKS ====================

export const useGetBlockchainPatientsById = (id: string) => {
    const [patient, setPatient] = useState<BlockchainPatientWithDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatient = async () => {
        if (!id) {
            setLoading(false);
            setError("Missing patient ID");
            return;
        }
        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainPatientWithDetails>>(`/blockchain/patients/${id}`);
            const responseData = response.data;
            if (!responseData.data || !responseData.data || responseData.status == 'error') {
                throw new Error("No patient data found");
            }
            setPatient(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch patient");
            setPatient(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatient();
    }, [id]);

    return { patient, loading, error, refetch: fetchPatient };
}

export const useGetBlockchainPatientsByName = (patientName: string) => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = async () => {
        if (!patientName) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/blockchain/patients/`, {
                params: { patientName }
            });
            setPatients(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch patients");
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [patientName]);

    return { patients, loading, error, refetch: fetchPatients };
}

export const useGetAllBlockchainPatients = () => {
    const [patients, setPatients] = useState<BlockchainPatientWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainPatientWithDetails[]>>('/blockchain/patients');
            const responseData = response.data;
            if (!responseData.data || !responseData.data || responseData.status == 'error') {
                throw new Error("No patient data found");
            }
            console.log("Patients fetched successfully:", responseData.data);
            setPatients(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch patients");
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return { patients, loading, error, refetch: fetchPatients };
}

export const useCreateBlockchainPatient = () => {
    const [loading, setLoading] = useState(false);

    const createPatient = async (data: BlockchainCreatePatientRequest) => {
        setLoading(true);
        try {
            const response = await api.post('/blockchain/patients/', data);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { createPatient, loading };
}

export const useUpdateBlockchainPatient = () => {
    const [loading, setLoading] = useState(false);

    const updatePatient = async (data: BlockchainUpdatePatientRequest) => {
        setLoading(true);
        try {
            const response = await api.patch('/blockchain/patients/', data);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { updatePatient, loading };
}

export const useDeleteBlockchainPatient = () => {
    const [loading, setLoading] = useState(false);

    const deletePatient = async (patientId: number) => {
        setLoading(true);
        try {
            const response = await api.delete(`/blockchain/patients/${patientId}`);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { deletePatient, loading };
}

// ==================== CLINICAL TEST HOOKS ====================

export const useGetBlockchainPatientClinicalTests = (patientId?: string) => {
    const [clinicalTests, setClinicalTests] = useState<BlockchainClinicalTestWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClinicalTests = async () => {
        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainClinicalTestWithDetails[]>>(`/blockchain/clinical-tests/patients/${patientId}`);
            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No clinical tests found for this patient");
            }
            setClinicalTests(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch clinical tests");
            setClinicalTests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinicalTests();
    }, [patientId]);

    return { clinicalTests, loading, error, refetch: fetchClinicalTests };
}

export const useGetBlockchainAllPatientClinicalTests = () => {
    const [allPatientClinicalTests, setAllPatientClinicalTests] = useState<BlockchainPatientClinicalTestWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllPatientClinicalTests = async () => {
        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainPatientClinicalTestWithDetails[]>>(`/blockchain/clinical-tests/patients/all`);
            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No clinical tests found for any patient");
            }
            setAllPatientClinicalTests(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch all patient clinical tests");
            setAllPatientClinicalTests([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllPatientClinicalTests();
    }, []);

    return { allPatientClinicalTests, loading, error, refetch: fetchAllPatientClinicalTests };
}

export const useGetBlockchainClinicalTestById = (testId: string) => {
    const [clinicalTest, setClinicalTest] = useState<BlockchainClinicalTestWithDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClinicalTest = async () => {
        if (!testId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainClinicalTestWithDetails>>(`/blockchain/clinical-tests/${testId}`);
            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No clinical test data found");
            }
            setClinicalTest(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch clinical test");
            setClinicalTest(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinicalTest();
    }, [testId]);

    return { clinicalTest, loading, error, refetch: fetchClinicalTest };
}

export const useCreateBlockchainClinicalTest = () => {
    const [loading, setLoading] = useState(false);

    const createClinicalTest = async (data: BlockchainCreateClinicalTestRequest) => {
        setLoading(true);
        try {
            const response = await api.post('/blockchain/clinical-tests/', data);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { createClinicalTest, loading };
}

export const useUpdateBlockchainClinicalTest = () => {
    const [loading, setLoading] = useState(false);

    const updateClinicalTest = async (data: BlockchainUpdateClinicalTestRequest) => {
        setLoading(true);
        try {
            const response = await api.patch('/blockchain/clinical-tests/', data);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { updateClinicalTest, loading };
}

export const useDeleteBlockchainClinicalTest = () => {
    const [loading, setLoading] = useState(false);

    const deleteClinicalTest = async (testId: number) => {
        setLoading(true);
        try {
            const response = await api.delete(`/blockchain/clinical-tests/${testId}`);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { deleteClinicalTest, loading };
}

// ==================== DISEASE PROGRESSION HOOKS ====================

export const useGetBlockchainPatientDiseaseProgressions = (patientId?: string) => {
    const [diseaseProgressions, setDiseaseProgressions] = useState<BlockchainDiseaseProgressionWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDiseaseProgressions = async () => {
        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainDiseaseProgressionWithDetails[]>>(`/blockchain/disease-progressions/patients/${patientId}`);
            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No disease progressions found for this patient");
            }
            setDiseaseProgressions(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch disease progressions");
            setDiseaseProgressions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiseaseProgressions();
    }, [patientId]);

    return { diseaseProgressions, loading, error, refetch: fetchDiseaseProgressions };
}

export const useGetBlockchainAllPatientDiseaseProgressions = () => {
    const [allPatientDiseaseProgressions, setPatientDiseaseProgressions] = useState<BlockchainPatientDiseaseProgressionWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllPatientDiseaseProgressions = async () => {
        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainPatientDiseaseProgressionWithDetails[]>>(`/blockchain/disease-progressions/patients/all`);
            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No disease progressions found for any patient");
            }
            setPatientDiseaseProgressions(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch all patient disease progressions");
            setPatientDiseaseProgressions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPatientDiseaseProgressions();
    }, []);

    return { allPatientDiseaseProgressions, loading, error, refetch: fetchAllPatientDiseaseProgressions };
}

export const useGetBlockchainDiseaseProgressionById = (progressionId: string) => {
    const [diseaseProgression, setDiseaseProgression] = useState<BlockchainDiseaseProgressionWithDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDiseaseProgression = async () => {
        if (!progressionId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainDiseaseProgressionWithDetails>>(`/blockchain/disease-progressions/${progressionId}`);

            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No disease progression data found");
            }
            setDiseaseProgression(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch disease progression");
            setDiseaseProgression(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiseaseProgression();
    }, [progressionId]);

    return { diseaseProgression, loading, error, refetch: fetchDiseaseProgression };
}

export const useCreateBlockchainDiseaseProgression = () => {
    const [loading, setLoading] = useState(false);

    const createDiseaseProgression = async (data: BlockchainCreateDiseaseProgressionRequest) => {
        setLoading(true);
        try {
            const response = await api.post('/blockchain/disease-progressions/', data);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { createDiseaseProgression, loading };
}

export const useUpdateBlockchainDiseaseProgression = () => {
    const [loading, setLoading] = useState(false);

    const updateDiseaseProgression = async (data: BlockchainUpdateDiseaseProgressionRequest) => {
        setLoading(true);
        try {
            const response = await api.patch('/blockchain/disease-progressions/', data);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { updateDiseaseProgression, loading };
}

export const useDeleteBlockchainDiseaseProgression = () => {
    const [loading, setLoading] = useState(false);

    const deleteDiseaseProgression = async (progressionId: number) => {
        setLoading(true);
        try {
            const response = await api.delete(`/blockchain/disease-progressions/${progressionId}`);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { deleteDiseaseProgression, loading };
}

// ==================== MEDICAL RECORD HOOKS ====================

export const useGetBlockchainPatientMedicalRecords = (patientId?: string) => {
    const [patientMedicalRecords, setPatientMedicalRecords] = useState<BlockchainMedicalRecordWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatientMedicalRecords = async () => {
        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainMedicalRecordWithDetails[]>>(`/blockchain/medical-records/patients/${patientId}`);
            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No medical records found for this patient");
            }
            setPatientMedicalRecords(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch medical records");
            setPatientMedicalRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientMedicalRecords();
    }, [patientId]);

    return { patientMedicalRecords, loading, error, refetch: fetchPatientMedicalRecords };
}

export const useGetBlockchainAllPatientMedicalRecords = () => {
    const [allPatientMedicalRecords, setAllPatientMedicalRecords] = useState<BlockchainPatientMedicalRecordWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllPatientMedicalRecords = async () => {
        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainPatientMedicalRecordWithDetails[]>>(`/blockchain/medical-records/patients/all`);
            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No medical records found for any patient");
            }
            setAllPatientMedicalRecords(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch all patient medical records");
            setAllPatientMedicalRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPatientMedicalRecords();
    }, []);

    return { allPatientMedicalRecords, loading, error, refetch: fetchAllPatientMedicalRecords };
}

export const useGetBlockchainMedicalRecordById = (recordId: string) => {
    const [medicalRecord, setMedicalRecord] = useState<BlockchainMedicalRecordWithDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMedicalRecord = async () => {
        if (!recordId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get<BlockchainResponse<BlockchainMedicalRecordWithDetails>>(`/blockchain/medical-records/${recordId}`);
            const responseData = response.data;
            if (!responseData.data || responseData.status === 'error') {
                throw new Error("No medical record data found");
            }
            setMedicalRecord(responseData.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch medical record");
            setMedicalRecord(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicalRecord();
    }, [recordId]);

    return { medicalRecord, loading, error, refetch: fetchMedicalRecord };
}

export const useCreateBlockchainMedicalRecord = () => {
    const [loading, setLoading] = useState(false);

    const createMedicalRecord = async (data: BlockchainCreateMedicalRecordRequest) => {
        setLoading(true);
        try {
            const response = await api.post('/blockchain/medical-records/', data);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { createMedicalRecord, loading };
}

// ==================== LEGACY FUNCTION EXPORTS (for backward compatibility) ====================

export const blockchainCreateNewPatient = (data: BlockchainCreatePatientRequest) => {
    return api.post('/blockchain/patients/', data);
}

export const blockchainUpdatePatient = (data: BlockchainUpdatePatientRequest) => {
    return api.patch('/blockchain/patients/', data);
}

export const blockchainDeletePatient = (patientId: number) => {
    return api.delete(`/blockchain/patients/${patientId}`);
}

export const blockchainCreateClinicalTest = (data: BlockchainCreateClinicalTestRequest) => {
    return api.post('/blockchain/clinical-tests/', data);
}

export const blockchainUpdateClinicalTest = (data: BlockchainUpdateClinicalTestRequest) => {
    return api.patch('/blockchain/clinical-tests/', data);
}

export const blockchainDeleteClinicalTest = (testId: number) => {
    return api.delete(`/blockchain/clinical-tests/${testId}`);
}

export const blockchainCreateDiseaseProgression = (data: BlockchainCreateDiseaseProgressionRequest) => {
    return api.post('/blockchain/disease-progressions/', data);
}

export const blockchainUpdateDiseaseProgression = (data: BlockchainUpdateDiseaseProgressionRequest) => {
    return api.patch('/blockchain/disease-progressions/', data);
}

export const blockchainDeleteDiseaseProgression = (progressionId: number) => {
    return api.delete(`/blockchain/disease-progressions/${progressionId}`);
}

export const blockchainCreateMedicalRecord = (data: BlockchainCreateMedicalRecordRequest) => {
    return api.post('/blockchain/medical-records/', data);
}