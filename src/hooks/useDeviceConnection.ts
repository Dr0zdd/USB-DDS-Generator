// src/hooks/useDeviceConnection.ts
import { useState, useCallback } from 'react';

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

    const connect = useCallback(async () => {
        try {
            // TODO: здесь будет реальное подключение к DDS (WebUSB / WebSerial / WebSocket)
            setConnectionState({
                isConnected: true,
                isInitialized: true,
                statusMessage: 'Устройство подключено и инициализировано',
            });
        } catch (e) {
            console.error('[useDeviceConnection] Ошибка подключения:', e);
            setConnectionState({
                isConnected: false,
                isInitialized: false,
                statusMessage: 'Ошибка подключения',
            });
        }
    }, []);

    const disconnect = useCallback(async () => {
        try {
            // TODO: здесь — реальный разрыв соединения
            setConnectionState({
                isConnected: false,
                isInitialized: false,
                statusMessage: 'Отключено',
            });
        } catch (e) {
            console.error('[useDeviceConnection] Ошибка отключения:', e);
            setConnectionState(prev => ({
                ...prev,
                isConnected: false,
                isInitialized: false,
                statusMessage: 'Ошибка при отключении',
            }));
        }
    }, []);

    return {
        connectionState,
        connect,
        disconnect,
    };
}
