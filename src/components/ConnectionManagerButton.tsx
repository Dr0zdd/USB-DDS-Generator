// src/components/ConnectionManagerButton.tsx
import React from 'react';
import { useDeviceConnectionHook } from '../hooks/useDeviceConnectionHook';

const ConnectionManagerButton: React.FC = () => {
    const { connectionState, connectDevice, disconnectDevice } = useDeviceConnectionHook();

    // Обработчики, которые вызывают хук
    const handleConnectClick = async () => {
        if (connectionState.isConnected && connectionState.isInitialized) {
            alert('Устройство уже готово к работе!');
            return;
        }
        await connectDevice();
    };

    const handleDisconnectClick = () => {
        disconnectDevice();
    }


    // Определяем класс для кнопки и активности
    const isReadyToRun = connectionState.isConnected && connectionState.isInitialized;

    return (
        <div className="p-6 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-white tracking-wide uppercase">Управление соединением</h2>

            {/* Статус */}
            <div className={`p-3 rounded-lg mb-6 flex items-center gap-3 ${connectionState.isConnected ? 'bg-green-900/50 border border-green-700' : connectionState.statusMessage.includes('Ошибка') ? 'bg-red-900/50 border border-red-700' : 'bg-gray-800 border border-gray-700'}`}>
                <div className={`w-3 h-3 rounded-full ${connectionState.isConnected && connectionState.isInitialized ? 'bg-green-400 animate-pulse' : connectionState.statusMessage.includes('Ошибка') ? 'bg-red-400' : 'bg-gray-600'}`}></div>
                <span className="text-sm font-mono text-white">{connectionState.statusMessage}</span>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4">
                <button
                    onClick={handleConnectClick}
                    disabled={isReadyToRun} // Отключаем, если уже успешно подключено
                    className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                        !isReadyToRun ? 'bg-accent hover:bg-green-500 text-black' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {connectionState.isConnected && connectionState.isInitialized
                        ? 'АКТИВНО (ГОТОВО)'
                        : 'ПОДКЛЮЧИТЬ И ИНИЦИАЛИЗИРОВАТЬ'}
                </button>

                <button
                    onClick={handleDisconnectClick}
                    className="px-6 py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white active:scale-[0.98]"
                >
                    Отключиться
                </button>
            </div>
        </div>
    );
};

export default ConnectionManagerButton;
