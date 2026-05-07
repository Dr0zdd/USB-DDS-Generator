// src/hooks/useDeviceConnectionHook.ts
import { useState, useCallback } from 'react';
import { initializeConnection } from '../api/deviceService';

interface ConnectionState {
    isConnected: boolean;
    isInitialized: boolean;
    statusMessage: string;
}

/**
 * Хук для управления жизненным циклом подключения.
 */
export const useDeviceConnectionHook = () => {
    const [state, setState] = useState<ConnectionState>({
        isConnected: false,
        isInitialized: false,
        statusMessage: 'Ожидание подключения...',
    });

    // Функция подключения (логика с кнопкой)
    const connectDevice = useCallback(async () => {
        setState({ isConnected: false, isInitialized: false, statusMessage: 'Сканирование USB...' });

        try {
            const result = await initializeConnection();
            if (result.success) {
                setState({
                    isConnected: true,
                    isInitialized: true,
                    statusMessage: result.message
                });
            } else {
                setState(prev => ({ ...prev, statusMessage: `❌ ${result.message}` }));
            }
        } catch (error) {
            setState(prev => ({ ...prev, statusMessage: 'Критическая ошибка связи.' }));
        }
    }, []);

    // Функция отключения
    const disconnectDevice = useCallback(() => {
        console.log("[HOOK] Отключение устройства...");
        setState({
            isConnected: false,
            isInitialized: false,
            statusMessage: 'Ожидание подключения...'
        });
    }, []);

    return { connectionState: state, connectDevice, disconnectDevice };
};
