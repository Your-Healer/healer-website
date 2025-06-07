import api from "@/api/axios";
import { GetAppointmentsRequest, GetAppointmentsResponse, PaginationResponse } from "@/utils/types";
import { useEffect, useState } from "react";

export const getAppointments = (data: GetAppointmentsRequest) => {
    const [appointments, setAppointments] = useState<GetAppointmentsResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<PaginationResponse<GetAppointmentsResponse>>('/apppointments', {
            data
        })
            .then(res => {
                console.log("Appointments fetched successfully:", res.data);
                const appointmentsData = res.data.data || [];
                setAppointments(appointmentsData);
            })
            .catch(err => {
                console.error("Error fetching appointments:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [])

    return { appointments, loading };
}