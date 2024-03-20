/*
import { useEffect } from 'react';

export default function Offline({ children }) {

    useEffect(() => {}, [online]);

    useEffect(() => {
        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);
        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        };
    }, []);
}
*/