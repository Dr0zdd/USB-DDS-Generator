// src/components/ConnectionManagerButton.tsx
import React from 'react';
import { useDeviceConnection } from '../hooks/useDeviceConnection';

export const ConnectionManagerButton: React.FC = () => {
    const { connectionState, connect, disconnect } = useDeviceConnection();

    const isConnected = connectionState.isConnected;
    const isInitialized = connectionState.isInitialized;

    return (
        <div className="flex flex-col items-start gap-3 p-4 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-lg">

            <div className="text-lg font-mono">
                Статус:{" "}
                <span
                    className={
                        isConnected
                            ? "text-green-400"
                            : "text-red-400"
                    }
                >
                    {connectionState.statusMessage}
                </span>
            </div>

            {!isConnected ? (
                <button
                    onClick={connect}
                    className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-bold"
                >
                    Подключить устройство
                </button>
            ) : (
                <button
                    onClick={disconnect}
                    className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition font-bold"
                >
                    Отключить устройство
                </button>
            )}

            {isConnected && !isInitialized && (
                <div className="text-yellow-400 font-mono">
                    Инициализация…
                </div>
            )}
        </div>
    );
};
