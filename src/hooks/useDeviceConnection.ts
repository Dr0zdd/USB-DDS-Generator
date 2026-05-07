// src/hooks/useDeviceConnection.ts
import { useState, useCallback } from 'react';
import { deviceService } from '../api/deviceService';
import { DDSDeviceSimulator } from '../api/DDSDeviceSimulator';
import { TorDDSDevice } from '../types/deviceTypes';

export function useDeviceConnection() {
    const [device, setDevice] = useState<TorDDSDevice | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [status, setStatus] = useState('Отключено');

    const connect = useCallback(async () => {
        if (isConnected || isInitializing) return;

        setIsInitializing(true);
        setStatus('Поиск устройства...');

        try {
            const dev = await deviceService.requestDevice();
            setDevice(dev);
            setStatus('Инициализация...');
            await new Promise((r) => setTimeout(r, 300));

            setIsConnected(true);
            setStatus('Устройство подключено');
        } catch {
            setStatus('Ошибка подключения');
        }

        setIsInitializing(false);
    }, [isConnected, isInitializing]);

    const connectSimulated = useCallback(async () => {
        if (isConnected) return;

        setStatus('Запуск симулятора...');
        setIsInitializing(true);

        const sim = new DDSDeviceSimulator();
        await new Promise((r) => setTimeout(r, 300));

        setDevice(sim);
        setIsConnected(true);
        setStatus('Симулятор активен');
        setIsInitializing(false);
    }, [isConnected]);

    const disconnect = useCallback(() => {
        setDevice(null);
        setIsConnected(false);
        setStatus('Отключено');
    }, []);

    return {
        device,
        isConnected,
        isInitializing,
        status,
        connect,
        disconnect,
        connectSimulated,
    };
}
