// src/components/ConnectionManagerButton.tsx
import React from 'react';

interface Props {
    isConnected: boolean;
    isInitializing: boolean;
    status: string;
    connect: () => void;
    disconnect: () => void;
    connectSimulated: () => void;
}

export const ConnectionManagerButton: React.FC<Props> = ({
                                                             isConnected,
                                                             isInitializing,
                                                             status,
                                                             connect,
                                                             disconnect,
                                                             connectSimulated,
                                                         }) => {
    return (
        <div className="flex flex-col items-center gap-4">

            <button
                onClick={isConnected ? disconnect : connect}
                disabled={isInitializing}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                    isConnected
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                } ${isInitializing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isInitializing
                    ? 'Подключение...'
                    : isConnected
                        ? 'Отключить'
                        : 'Подключить устройство'}
            </button>

            {!isConnected && !isInitializing && (
                <button
                    onClick={connectSimulated}
                    className="px-6 py-3 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700"
                >
                    Тестовое подключение
                </button>
            )}

            <div className="text-sm text-gray-300">{status}</div>
        </div>
    );
};
