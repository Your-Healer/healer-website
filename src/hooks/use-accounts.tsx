import api from "@/api/axios";
import { AccountWithDetails } from "@/models/models";
import { GetAccountStatistics, GetAllAccountsRequest, GetMyWallet, PaginationResponse } from "@/utils/types";
import { useEffect, useState } from "react";

export const useGetAccounts = (params: GetAllAccountsRequest) => {
    const [accounts, setAccounts] = useState<AccountWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<PaginationResponse<AccountWithDetails>>("/accounts/", {
            params
        })
            .then(res => {
                console.log("Accounts fetched successfully:", res.data);
                const accountsData = res.data.data || [];
                setAccounts(accountsData);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return { accounts, loading };
}

export const useGetAccountStatistics = () => {
    const [statistics, setStatistics] = useState<GetAccountStatistics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<{
            statistics: GetAccountStatistics;
        }>("/accounts/statistics")
            .then(res => {
                console.log("Account statistics fetched successfully:", res.data);
                setStatistics(res.data.statistics);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return { statistics, loading };
}

export const useGetMyAccount = () => {
    const [account, setAccount] = useState<AccountWithDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<{
            account: AccountWithDetails;
        }>("/accounts/me")
            .then(res => {
                console.log("My account fetched successfully:", res.data);
                setAccount(res.data.account);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return { account, loading };
}

export const useGetMyWallet = () => {
    const [wallet, setWallet] = useState<any>(null); // Replace 'any' with your wallet type
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<GetMyWallet>("/accounts/me/wallet")
            .then(res => {
                console.log("My wallet fetched successfully:", res.data);
                setWallet(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return { wallet, loading };
}