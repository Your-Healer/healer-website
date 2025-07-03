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
            const res = await api.get<{
                account: AccountWithDetails;
            }>('/accounts/me');
            console.log("My account fetched successfully:", res.data);
            setAccount(res.data.account);
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

export const useUpdateMyAvatar = () => {
    const [loading, setLoading] = useState(false);

    const updateAvatar = async (avatar: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', avatar);

            const res = await api.patch('/accounts/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Avatar updated successfully:", res.data);
            return res.data;
        } catch (err) {
            console.error("Error updating avatar:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateAvatar, loading };
}

export const useUpdateMyProfile = () => {
    const [loading, setLoading] = useState(false);

    const updateProfile = async (profileData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        introduction?: string;
    }) => {
        setLoading(true);
        try {
            const res = await api.patch('/accounts/me/profile', profileData);
            console.log("Profile updated successfully:", res.data);
            return res.data;
        } catch (err) {
            console.error("Error updating profile:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading };
}

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const changePassword = async (passwordData: {
        currentPassword: string;
        newPassword: string;
    }) => {
        setLoading(true);
        try {
            const res = await api.patch('/accounts/me/password', passwordData);
            console.log("Password changed successfully:", res.data);
            return res.data;
        } catch (err) {
            console.error("Error changing password:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading };
}