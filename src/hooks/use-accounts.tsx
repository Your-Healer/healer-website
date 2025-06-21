import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AccountWithDetails } from '@/models/models';
import { GetAllAccountsRequest, PaginationResponse } from '@/utils/types';

export const useGetAccounts = (params: GetAllAccountsRequest) => {
    const [accounts, setAccounts] = useState<AccountWithDetails[]>([]);
    const [pagination, setPagination] = useState<PaginationResponse<AccountWithDetails>['meta'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const res = await api.get<PaginationResponse<AccountWithDetails>>('/accounts', {
                params
            });
            console.log("Accounts fetched successfully:", res.data);
            const accountsData = res.data.data || [];
            setAccounts(accountsData);
            setPagination(res.data.meta);
        } catch (err) {
            console.error("Error fetching accounts:", err);
            setAccounts([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [JSON.stringify(params)]);

    return { accounts, pagination, loading, refetch: fetchAccounts };
}

export const useGetMyAccount = (accountId: string) => {
    const [account, setAccount] = useState<AccountWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchMyAccount = async () => {
        setLoading(true);
        try {
            const res = await api.get<AccountWithDetails>('/accounts/me');
            console.log("My account fetched successfully:", res.data);
            setAccount(res.data);
        } catch (err) {
            console.error("Error fetching my account:", err);
            setAccount(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accountId) {
            fetchMyAccount();
        }
    }, [accountId]);

    return { account, loading, refetch: fetchMyAccount };
}