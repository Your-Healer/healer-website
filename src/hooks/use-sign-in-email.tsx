import { useEffect, useState } from 'react';
import api from '../api/axios';

export const useSignInEmail = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/login/username')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return { users, loading };
};
