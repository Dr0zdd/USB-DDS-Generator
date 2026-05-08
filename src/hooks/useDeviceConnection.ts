import { useCallback, useState } from 'react';

export interface ConnectionState {
    isConnected: boolean;
    isInitialized: boolean;
    statusMessage: string;
}

export function useDeviceConnection() {
    const [connectionState, setConnectionState] = useState<ConnectionState>({
        isConnected: false,
        isInitialized: false,
        statusMessage: 'Отключено',
    });

    const connectReal = useCallback(async () => {
        setConnectionState({
            isConnected: true,
            isInitialized: true,
            statusMessage: 'Реальное устройство подключено',
        });
    }, []);

    const connectSimulated = useCallback(async () => {
        setConnectionState({
            isConnected: true,
            isInitialized: true,
            statusMessage: 'Тестовое подключение (симулятор)',
        });
    }, []);

    const disconnect = useCallback(() => {
        setConnectionState({
            isConnected: false,
            isInitialized: false,
            statusMessage: 'Отключено',
        });
    }, []);

    return {
        connectionState,
        connectReal,
        connectSimulated,
        disconnect,
    };
}
