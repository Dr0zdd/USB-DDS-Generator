import React from 'react';
import { ConnectionState } from '../hooks/useDeviceConnection';

interface Props {
    connectionState: ConnectionState;
    onConnectReal: () => void;
    onConnectSimulated: () => void;
    onDisconnect: () => void;
}

export const ConnectionManagerButton: React.FC<Props> = ({
                                                             connectionState,
                                                             onConnectReal,
                                                             onConnectSimulated,
                                                             onDisconnect,
                                                         }) => {
    const isConnected = connectionState.isConnected;

    return (
        <div className="flex flex-col gap-3 p-4 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-lg">
            <div className="text-lg font-mono">
                Статус:{' '}
                <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
          {connectionState.statusMessage}
        </span>
            </div>

            {!isConnected && (
                <>
                    <button
                        onClick={onConnectReal}
                        className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-bold"
                    >
                        Подключить реальное устройство
                    </button>

                    <button
                        onClick={onConnectSimulated}
                        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-bold"
                    >
                        Тестовое подключение
                    </button>
                </>
            )}

            {isConnected && (
                <button
                    onClick={onDisconnect}
                    className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition font-bold"
                >
                    Отключить
                </button>
            )}
        </div>
    );
};
